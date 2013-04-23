var context = new webkitAudioContext();
var buffer, f;

loadSample = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        buffer = context.createBuffer(request.response, false);

        // var t = new soundtouch.RateTransposer(true);
        // t.rate = 2;

        var s = new soundtouch.Stretch(true);
        s.tempo = 0.5;

        f = new soundtouch.SimpleFilter(new soundtouch.WebAudioBufferSource(buffer), s);
    };
    request.send();
};

loadSample('/media/mp3/spanish_flea.mp3');

var BUFFER_SIZE = 1024;

var node = context.createJavaScriptNode(BUFFER_SIZE, 2, 2);

var samples = new Float32Array(BUFFER_SIZE * 2);

node.onaudioprocess = function(e) {
    var l = e.outputBuffer.getChannelData(0);
    var r = e.outputBuffer.getChannelData(1);
    var framesExtracted = f.extract(samples, BUFFER_SIZE);
    if (framesExtracted === 0) {
        pause();
    }
    for (var i = 0; i < framesExtracted; i++) {
        l[i] = samples[i * 2];
        r[i] = samples[i * 2 + 1];
    }
};

function play() {
    node.connect(context.destination);
}

function pause() {
    node.disconnect();
}
