"use strict";
define(function (require) {

    var appConstants = require('/app-constants.js');
    var facade = require('/app/core/facade.js');

    var currentUser = null;
    var plaintextProfile = null;

    facade.subscribe(appConstants.S2C_USER_LOGGED_IN, function (user) {
        currentUser = user;
        facade.sendNotification(appConstants.C2S_GET_PLAINTEXT_PROFILE);
    });

    facade.subscribe(appConstants.S2C_SEND_PLAINTEXT_PROFILE, function (profile) {
        plaintextProfile = profile;
        facade.sendNotification(appConstants.C2S_GET_CONTACT_LIST);
    });

    facade.subscribe(appConstants.C2S_LOG_OUT_USER, function () {
        currentUser = null;
    });

    console.log('app-proxy.js required');

    return {
        getCurrentUser: function () {
            return currentUser;
        },

        getCurrentUserId: function () {
            return currentUser._id;
        },

        getPlainTextProfileId: function () {
            return plaintextProfile._id;
        },
        
        getDefaultAvatarUrl: function() {
            return './img/stormtrooper.jpeg';
        }

    };

});