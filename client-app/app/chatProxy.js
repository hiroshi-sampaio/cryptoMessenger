"use strict";
define(function (require) {

    var appConstants = require('/app-constants');
    var facade = require('./facade.js');
    var appProxy = require('./appProxy.js');

    var chatData = {};
    var contactList = null;
    var recipientUser = null;

    facade.subscribe(appConstants.SELECT_CONTACT, function (contactUser) {
        recipientUser = contactUser;
        facade.sendNotification(appConstants.C2S_GET_CHAT_HISTORY, recipientUser._id);
    });

    facade.subscribe(appConstants.S2C_SEND_CONTACT_LIST, function (contacts) {
        contactList = contacts;
        contactList.forEach(function (contact) {
            chatData[contact._id] = { contact: contact };
        });
        facade.sendNotification(appConstants.CONTACT_LIST_RECEIVED);
        console.log(chatData);
    });

    facade.subscribe(appConstants.S2C_CHAT_MESSAGE, function (msg) {
        var contactUserId = (msg.sender == appProxy.getCurrentUserId() ? msg.recipient : msg.sender);
        if (chatData[contactUserId].history === undefined) {
            chatData[contactUserId].history = [];
        }
        chatData[contactUserId].history.push(msg);
        facade.sendNotification(appConstants.CHAT_HISTORY_UPDATED, contactUserId);
    });

    facade.subscribe(appConstants.S2C_SEND_CHAT_HISTORY, function (contactHistory) {
        chatData[contactHistory.contactUserId].history = contactHistory.history;
        facade.sendNotification(appConstants.CHAT_HISTORY_UPDATED, contactHistory.contactUserId);
        console.log(contactHistory.history);
    });

    console.log('chatProxy.js required');

    return {

        getContactList: function () {
            return contactList;
        },

        getRecipientUser: function () {
            return recipientUser;
        },

        getRecipientUserId: function () {
            return recipientUser;
        },

        getHistoryForRecipientUser: function () {
            return chatData[recipientUser._id].history;
        },

    }

});