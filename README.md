![vinyl image](http://findicons.com/files/icons/2315/default_icon/256/media_vinyl_33_1_3.png)
# vinyl-auth
A simple, short and vanilla javascript compatible token authentication library

## Configuration example
``` javascript
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
```

## Basic usage example
``` javascript
var auth = new VinylAuth(authConfig);
auth.initialize();

function doAuth() {
    auth.authenticate();
}

doAuth();
```

## TODO
- Local storage token module
- Token validation on refresh
- Refresh token mechanism
- Basic elements to indicate login process
