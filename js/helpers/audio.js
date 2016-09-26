export const context = new AudioContext();
export const audioElement = document.getElementById("player");
export const analyser = context.createAnalyser();
analyser.fftSize = 512;

export function getAudioData(){
  // could turn this into an audio object with decorators like get average vol
  let frequencyData = getFreqData(analyser);
  let currentVolume = 0;
  for(var i=0; i<frequencyData.length; i++) {
    currentVolume += frequencyData[i];
  }
  currentVolume /= analyser.fftSize;
  return {frequencyData, currentVolume}
}


var source = context.createMediaElementSource(audioElement);
source.connect(analyser);
source.connect(context.destination);

function getFreqData(analyser){
  let data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data
}
