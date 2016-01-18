var speakerQueueConfig = speakerQueueConfig || {};

(function () {
    XHR.getJSON('/api/config', function (data) {
        speakerQueueConfig = data;
    });
}());