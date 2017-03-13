/**
 * Created by Daniel on 12/03/2017.
 */
var authConfig = {
    authProviderPath: 'provider.html',          // the path for the auth provider page
    storageTTL: 60,                             // in seconds
    storage: new Vinyl.VinylStorage(localStorage),
    refreshTokenPath: 'refreshtoken.json',      // if path is not set, refresh token mechanism is deactivated
    refreshTokenInterval: 15,                    // in seconds
    handleAuthSuccess: function (userData) {
        console.log('auth success', userData);  // {auth_token: "xxxx", uid: "yyyy", name: "Slemp Diggler"}
    },
    handleAuthFailure: function (error) {
        console.log('auth failure', error);     // {reason: "unauthorized", errors: Array(1)}
    },
    handleAuthStart: function (event) {
        console.log('auth start', event);       // {message: "Auth has started"}
    },
    handleAuthLogout: function (event) {
        console.log('logout', event);           // {message: "Logout"}
    },
    handleAuthTokenExpiry: function (event) {
        console.log('token expired', event);    // {message: "Token has expired"}
    }
};

var auth = new Vinyl.VinylAuth(authConfig);
auth.initialize();

function doAuth(force) {
    auth.authenticate(force);       // Can be forced to ignore current storage
}

function showRecord() {
    console.log(auth.getRecord());
}

function logout() {
    auth.logout();
}

doAuth(false);


if (auth.getRecord() == false) {
    // Show login overlay
    // Overlay with injected template
    // Prompt login process
    // Show a link in case the pop up failed to open
    // Hide the overlay after successful login
    // +Show the overlay after logout
    // +Handle token expiry and show overlay and force re-login
}

