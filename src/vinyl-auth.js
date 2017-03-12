/**
 * Created by Daniel on 12/03/2017.
 */
'use strict';
var VinylAuth = (function vinylAuth(_config) {

    var requestCredentialsPollingTimer;
    var config = {
        authUrl: _config.authUrl || '',
        authSuccessCallback: _config.authSuccessCallback || console.log,
        authFailureCallback: _config.authFailureCallback || console.log,
        authStartCallback: _config.authStartCallback || console.log
    };

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
        config.authFailureCallback(reason);
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
        config.authSuccessCallback(user);
    }

    function authenticate () {
        config.authStartCallback({message: 'Auth has started'});
        openAuthWindow();
    }

    function openAuthWindow () {
        requestCredntialsViaPostMessage(createPopup(config.authUrl));
    }

    return {
        initialize: initialize,
        authenticate: authenticate
    }
});
