define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var Util = {
        debug: false,

        storageAvailable: function (type) {
            try {
                var storage = window[type],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return false;
            }
        },
        removeItem: function (key) {
            if (this.storageAvailable('localStorage')) {
                var storage = window['localStorage'];
                storage.removeItem(key);
                if(this.debug) {
                    console.log("Removed: " + key);
                }
            }
        },
        setItem: function (key, value) {
            if (this.storageAvailable('localStorage')) {
                var storage = window['localStorage'];
                storage.setItem(key, value);
                if(this.debug) {
                    console.log("Set: " + key);
                }
            }
        },
        getItem: function (key) {
            if (this.storageAvailable('localStorage')) {
                var storage = window['localStorage'];
                var value = storage.getItem(key);
                if(this.debug) {
                    console.log("Got: " + key + ": " + value);
                }
                return value;
            }
        }
    };

    return Util;
});