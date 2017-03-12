/**
 * Created by Daniel on 12/03/2017.
 */
var authConfig = {
    authUrl: 'provider.html',
    authSuccessCallback: function (userData) {
        console.log('auth success', userData);
    },
    authFailureCallback: function (error) {
        console.log('auth failure', error);
    },
    authStartCallback: function (event) {
        console.log('auth start', event);
    }
};

var auth = new VinylAuth(authConfig);
auth.initialize();

function doAuth() {
    auth.authenticate();
}

doAuth();

