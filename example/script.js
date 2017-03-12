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
    }
};

var auth = new VinylAuth(authConfig);
auth.initialize();
auth.authenticate();