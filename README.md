![vinyl image](http://findicons.com/files/icons/2315/default_icon/256/media_vinyl_33_1_3.png)
# vinyl-auth
A simple, short and vanilla javascript compatible token authentication library

## Configuration example
``` javascript
var authConfig = {
    authProviderPath: 'provider.html',          // the path for the auth provider page
    storageTTL: 60,                             // in seconds
    storage: new VinylStorage(localStorage),
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
```

## Basic usage example
``` javascript

var auth = new VinylAuth(authConfig);
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
```

## TODO
- ~~Local storage token module~~
- ~~Token validation on refresh~~
- ~~Refresh token mechanism~~
- Login Overlay example
