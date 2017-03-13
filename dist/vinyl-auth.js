/**
 * Created by Daniel on 12/03/2017.
 */
'use strict';
var Vinyl = Vinyl || {};
Vinyl.VinylAuth = (function vinylAuth(_config) {

    var config = {
        authProviderPath: _config.authProviderPath || '',
        handleAuthSuccess: _config.handleAuthSuccess || console.log,
        handleAuthFailure: _config.handleAuthFailure || console.log,
        handleAuthStart: _config.handleAuthStart || console.log,
        handleAuthLogout: _config.handleAuthLogout || console.log,
        handleAuthTokenExpiry: _config.handleAuthTokenExpiry || console.log,
        storage: _config.storage || null,
        storageTTL: _config.storageTTL || 1200, // seconds
        refreshTokenPath: _config.refreshTokenPath || null,
        refreshTokenInterval: _config.refreshTokenInterval || 600, // seconds
        requestCredentialsPollingTimerInterval: 500
    };

    var requestCredentialsPollingTimer;

    var currentUserRecord = null;

    function initialize () {
        initializeListeners();
        if (!!config.refreshTokenPath) {
            initRefreshToken();
        }
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
            requestCredentialsPollingTimer = setTimeout(function() { requestCredntialsViaPostMessage(authWindow); }, config.requestCredentialsPollingTimerInterval);
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
            setRecord(ev.data);
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

    function authenticate (forceAuth) {
        forceAuth = forceAuth || false;
        config.handleAuthStart({message: 'Auth has started', forceAuth: forceAuth});
        var record = getRecord();
        if (!forceAuth && !!record) {
            handleValidAuth(record);
        } else {
            openAuthWindow();
        }
    }

    function refreshToken() {
        var record = getRecord();
        if (!!record) {
            var xmlhttp = new XMLHttpRequest();
            var url = config.refreshTokenPath + "?token=" + record.auth_token;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var record = JSON.parse(this.responseText);
                    setRecord(record);
                } else if (this.readyState == 4) {
                    setRecord(null);
                    config.handleAuthTokenExpiry({message: "Token has expired"});
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        initRefreshToken();
    }

    function initRefreshToken() {
        setTimeout(refreshToken, config.refreshTokenInterval * 1000);
    }

    function openAuthWindow () {
        requestCredntialsViaPostMessage(createPopup(config.authProviderPath));
    }

    function getRecord () {
        if (currentUserRecord == null && !!config.storage) {
            currentUserRecord = config.storage.get();
        }
        return currentUserRecord;
    }

    function setRecord (record) {
        currentUserRecord = record;
        if(config.storage) {
            config.storage.set(record, config.storageTTL);
        }
    }

    function logout () {
        currentUserRecord = null;
        if (!!config.storage) {
            config.storage.set(null);
        }
        config.handleAuthLogout({message: "Logout"})
    }

    return {
        initialize: initialize,
        authenticate: authenticate,
        getRecord: getRecord,
        logout: logout
    }
});
Vinyl.VinylStorage = (function vinylStorage (storage) {

    function get () {
        var record = storage.getItem('vinylRecord');

        if (record == null) {
            return false;
        }

        try {
            var recordObject = JSON.parse(record);
        } catch (e) {
            return false;
        }

        if (recordObject.TTL < getCurrentTimestamp()) {
            return false;
        }
        return recordObject;
    }

    function set (record, TTL) {
        if (record == null) {
            return delete storage['vinylRecord'];
        }
        record.TTL = getCurrentTimestamp() + TTL;
        storage.setItem('vinylRecord', JSON.stringify(record));
    }

    function getCurrentTimestamp() {
        return Math.floor(Date.now() /1000);
    }

    return {
        get: get,
        set: set
    }
});