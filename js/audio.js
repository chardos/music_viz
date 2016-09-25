export const context = new AudioContext();
export const audioElement = document.getElementById("player");
export const analyser = context.createAnalyser();
analyser.fftSize = 512;

var source = context.createMediaElementSource(audioElement);
source.connect(analyser);
source.connect(context.destination);
