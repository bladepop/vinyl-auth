/**
 * Created by Daniel on 12/03/2017.
 */
'use strict';
var VinylAuth = (function vinylAuth(_config) {

    var config = {
        authProviderUrl: _config.authProviderUrl || '',
        handleAuthSuccess: _config.handleAuthSuccess || console.log,
        handleAuthFailure: _config.handleAuthFailure || console.log,
        handleAuthStart: _config.handleAuthStart || console.log
    };

    var requestCredentialsPollingTimer;


    function initialize () {
        initializeListeners();
        console.log('authModule initialized');
    }

    function initializeListeners () {
        var listener = handlePostMessage.bind(this);

        if (window.addEventListener) {
            window.addEventListener("message", listener, false);
        }
    }

    function createPopup (url) {
        return window.open(url, '_blank', 'closebuttoncaption=Cancel');
    }

    function requestCredntialsViaPostMessage (authWindow) {
        if (authWindow == null) {
           cancel({
                reason: 'unauthorized',
                errors: ['Auth window failed to open']
           });
        } else if (authWindow.closed) {
            handleAuthWindowClose();
        } else {
            authWindow.postMessage("requestCredentials", "*");
            requestCredentialsPollingTimer = setTimeout(function() { requestCredntialsViaPostMessage(authWindow); }, 500);
        }
    }

    function handleAuthWindowClose () {
        cancel({
            reason: 'unauthorized',
            errors: ['User canceled login']
        });
    }

    function cancel (reason) {
        requestCredentialsPollingTimer && clearTimeout(requestCredentialsPollingTimer);
        config.handleAuthFailure(reason);
        setTimeout(function () { requestCredentialsPollingTimer = null; }, 0);
    }

    function handlePostMessage (ev) {
        if (ev.data.message == 'deliverCredentials') {
            delete ev.data.message;
            handleValidAuth(ev.data);
        }
        if (ev.data.message == 'authFailure') {
            var error = {
                reason: 'unauthorized',
                errors: [ev.data.error]
            }
            cancel(error);
        }
    }

    function handleValidAuth (user) {
        requestCredentialsPollingTimer && clearTimeout(requestCredentialsPollingTimer);
        config.handleAuthSuccess(user);
    }

    function authenticate () {
        config.handleAuthStart({message: 'Auth has started'});
        openAuthWindow();
    }

    function openAuthWindow () {
        requestCredntialsViaPostMessage(createPopup(config.authProviderUrl));
    }

    return {
        initialize: initialize,
        authenticate: authenticate
    }
});
