
    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function() {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized',
        statusChange: 'auth-status-change'
    });

    app.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.service('AuthService', function($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response, resetting) {
            var data = response.data;
            // check for reset password - shortcircuit saving user to session
            if (data.user.resetPassword && !resetting) {
                return data.user;
            }
            return $http.get('/login' + data.user)
                .then(function(res) {
                    Session.create(data.id, data.user, res.data);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    return data.user;
                });
        }

        // Uses the session factory to see if an
        // authenticated views is currently registered.
        this.isAuthenticated = function() {
            return !!Session.user;
        };

        this.isAdmin = function() {
            return Session.user.isAdmin;
        };

        this.isSeller = () => Session.user.isSeller;

        this.getLoggedInUser = function(fromServer) {

            // If an authenticated session exists, we
            // return the views attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a views, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function() {
                return null;
            });

        };

        function onGettingCart(res) {
            Session.createCart(res.data);
            return res.data;
        }

        this.getCart = function() {
            if (Session.cart) return $q.when(Session.cart);
            return $http.get('/api/cart').then(function(res) {
                return $http.get('/api/orders/' + res.data)
                    .then(onGettingCart);
            });
        };

        this.login = function(credentials, resetting) {
            return $http.post('/login', credentials)
                .then(function(res) {
                    console.log('yo angular login auth', res);
                    return onSuccessfulLogin(res, resetting);
                })
                .catch(function() {
                    return $q.reject({
                        message: 'Invalid login credentials.'
                    });
                });
        };

        this.logout = function() {
            return $http.get('/logout').then(function() {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

        this.resetPassword = (userId, password) => {
            return $http.put('/api/users/' + userId, {
                    resetPassword: false,
                    password: password
                })
                    .then(res => res.data);
        };

        this.signup = (credentials) => {
            return $http.post('/api/users', credentials)
                    .then(res => res.data);
        };

        this.updateUser = (userId, info) => {
            if (info.isSeller) {
                // make artist profile
                return $http.post('/api/artists', {name: info.artistName})
                        .then(res => res.data)
            .then(artist => {
                    info.artistName = undefined;
                info.artistProfile = artist._id;
                return $http.put('/api/users/' + userId, info)
                        .then(res => res.data);
            });
        } else {
            return null;
        }
    };

});

app.service('Session', function($rootScope, AUTH_EVENTS) {

    var self = this;

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
        self.destroy();
    });

    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function() {
        self.destroy();
    });

    this.id = null;
    this.user = null;
    this.cart = null;

    this.create = function(sessionId, user, cart) {
        this.id = sessionId;
        this.user = user;
        this.cart = cart;
    };

    this.createCart = function(cart) {
        this.cart = cart;
    };

    this.destroy = function() {
        this.id = null;
        this.user = null;
        this.cart = null;
    };

    this.updateUser = function(userData) {
        _.extend(this.user, userData);
    };

    this.updateCart = function(cartData) {
        _.extend(this.cart, cartData);
    };

});

module.exports = app;
