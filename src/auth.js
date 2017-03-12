/**
 * Created by Daniel on 12/03/2017.
 */
'use strict';
var AuthModule = (function authModule(config) {

    var requestCredentialsPollingTimer;


    function initialize () {
        this.initializeListeners();
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
        if (authWindow.closed) {

        } else {
            authWindow.postMessage("requestCredentials", "*");
            requestCredentialsPollingTimer = setTimeout(function() { requestCredntialsViaPostMessage(authWindow); }, 500);
        }
    }

    function handlePostMessage (ev) {
        console.log(ev);
        if (ev.data.message == 'deliverCredentials') {
            delete ev.data.message;

            handleValidAuth(ev.data, true);
            // broadcast login
        }
        if (ev.data.message == 'authFailure') {
            var error = {
                reason: 'unauthorized',
                errors: [ev.data.error]
            }
            // cancel(error) + broadcast error
        }
    }

    function handleValidAuth (user, setHeader) {
        setHeader = setHeader || false;

        requestCredentialsPollingTimer && clearTimeout(requestCredentialsPollingTimer);

        console.log(user);

    }

    function authenticate () {
        openAuthWindow();
    }

    function openAuthWindow () {
        requestCredntialsViaPostMessage(createPopup(config.authUrl));
    }

    return {
        initialize: initialize,
        initializeListeners: initializeListeners,
        authenticate: authenticate
    }
});


var authConfig = {
    authUrl: 'provider.html'
};

var auth = new AuthModule(authConfig);
auth.initialize();
auth.authenticate();