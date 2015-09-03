var d3 = require('d3');

// audio setup
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById('audioElement');
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();

// Bind our analyser to the media element source.
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

// buffer to hold frequency data
var frequencyData = new Uint8Array(180);

// auto play music
playMusic();

// state
var size = { width: window.innerWidth, height: window.innerHeight };
var centerX = size.width / 2;
var centerY = size.height / 2;
var isPlaying = true;

var svg = d3
    .select('body')
    .append('svg');

svg.on('click', function() {
    if (!isPlaying) playMusic();
    else            pauseMusic();

    isPlaying = !isPlaying;
});

svg
    .selectAll('line')
    .data(frequencyData)
    .enter()
    .append('line')
    .attr('x1', centerX)
    .attr('y1', centerY);

d3.timer(function() {
    analyser.getByteFrequencyData(frequencyData);

    svg
        .selectAll('line')
        .data(frequencyData)
        .attr('x2', function (d, i) {
            return centerX + (Math.cos(i) * d * 2);
        })
        .attr('y2', function (d, i) {
            return centerY + (Math.sin(i) * d * 2);
        })
        .attr('stroke', function(d) {
            return 'rgb(' + (d) + ', 0, ' + (d * 10) + ')';
        })
        .attr('stroke-width', function(d) {
            return d / 10;
        });
});

function playMusic() {
    document.getElementById('audioElement').play();
}

function pauseMusic() {
    document.getElementById('audioElement').pause();
}
