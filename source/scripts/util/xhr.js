var XHR = (function () {
    
    /*
        This function was taken from: https://plainjs.com/javascript/ajax/send-ajax-get-and-post-requests-47/
    */
    function get(url, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState >3 && xhr.status === 200) {
                success(xhr.responseText);
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        return xhr;
    }
    
    function getJSON(url, success) {
        return get(url, function (data) {
            success(JSON.parse(data)); 
        });
    }
    
    return {
        get: get,
        getJSON: getJSON  
    };
    
}());