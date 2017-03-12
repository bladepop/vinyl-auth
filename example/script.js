/**
 * Created by Daniel on 12/03/2017.
 */
var authConfig = {
    authProviderUrl: 'provider.html',
    handleAuthSuccess: function (userData) {
        console.log('auth success', userData);
    },
    handleAuthFailure: function (error) {
        console.log('auth failure', error);
    },
    handleAuthStart: function (event) {
        console.log('auth start', event);
    }
};

var auth = new VinylAuth(authConfig);
auth.initialize();

function doAuth() {
    auth.authenticate();
}

doAuth();

