var context = new webkitAudioContext();
var buffer, node;

loadSample = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        buffer = context.createBuffer(request.response, false);

        var st = new soundtouch.SoundTouch();
        st.tempo = 0.75;
        var filter = new soundtouch.SimpleFilter(new soundtouch.WebAudioBufferSource(buffer), st);
        node = soundtouch.getWebAudioNode(context, filter);
    };
    request.send();
};

loadSample('/media/mp3/spanish_flea.mp3');

function play() {
    node.connect(context.destination);
}
function pause() {
    node.disconnect();
}
