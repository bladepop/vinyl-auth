/**
 * Created by Daniel on 12/03/2017.
 */
var VinylStorage = (function vinylStorage (storage) {

    function get () {
        var record = storage.getItem('vinylRecord');

        if (record == null) {
            return false;
        }

        try {
            var recordObject = JSON.parse(record);
        } catch (e) {
            return false;
        }

        if (recordObject.TTL < getCurrentTimestamp()) {
            return false;
        }
        return recordObject;
    }

    function set (record, TTL) {
        record.TTL = getCurrentTimestamp() + TTL;
        storage.setItem('vinylRecord', JSON.stringify(record));
    }

    function getCurrentTimestamp() {
        return Math.floor(Date.now() /1000);
    }

    return {
        get: get,
        set: set
    }
});