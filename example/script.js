/**
 * Created by Daniel on 12/03/2017.
 */
var authConfig = {
    authProviderUrl: 'provider.html',
    handleAuthSuccess: function (userData) {
        console.log('auth success', userData); // {auth_token: "xxxx", uid: "yyyy", name: "Slemp Diggler"}
    },
    handleAuthFailure: function (error) {
        console.log('auth failure', error); // {reason: "unauthorized", errors: Array(1)}
    },
    handleAuthStart: function (event) {
        console.log('auth start', event); //  // {message: "Auth has started"}
    }
};

var auth = new VinylAuth(authConfig);
auth.initialize();

function doAuth() {
    auth.authenticate();
}

doAuth();

