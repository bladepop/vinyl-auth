/**
 * Created by Daniel on 12/03/2017.
 */
var authConfig = {
    authProviderPath: 'provider.html',          // the path for the auth provider page
    storageTTL: 10,                             // in seconds
    storage: new VinylStorage(localStorage),
    refreshTokenPath: 'refreshtoken.json',      // if path is not set, refresh token mechanism is deactivated
    refreshTokenInterval: 5,                    // in seconds
    handleAuthSuccess: function (userData) {
        console.log('auth success', userData);  // {auth_token: "xxxx", uid: "yyyy", name: "Slemp Diggler"}
    },
    handleAuthFailure: function (error) {
        console.log('auth failure', error);     // {reason: "unauthorized", errors: Array(1)}
    },
    handleAuthStart: function (event) {
        console.log('auth start', event);       // {message: "Auth has started"}
    }
};

var auth = new VinylAuth(authConfig);
auth.initialize();

function doAuth(force) {
    auth.authenticate(force);
}

function showRecord() {
    console.log(auth.getRecord());
}

doAuth(false);

