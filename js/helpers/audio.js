// export const audio = {};
export const context = new AudioContext();
console.log(context);
export const analyser = context.createAnalyser();
export const audioElement = document.getElementById("player");
analyser.fftSize = 512;

function plugAudioElement(){
  var source = context.createMediaElementSource(audioElement);
  source.connect(analyser);
  source.connect(context.destination);
}
// plugAudioElement()

function plugMicrophone(){
  navigator.getUserMedia({ audio: true }, callback, error);

  function callback(stream){
    var source = context.createMediaStreamSource(stream);
    source.connect(analyser);
  }
  function error(err){
    console.log(err);
  }
}
plugMicrophone()

export function getAudioData(){
  // could turn this into an audio object with decorators like get average vol
  let frequencyData = _getFreqData(analyser);
  let currentVolume = 0;
  for(var i=0; i<frequencyData.length; i++) {
    currentVolume += frequencyData[i];
  }
  currentVolume /= analyser.fftSize;
  return {frequencyData, currentVolume}
}

function _getFreqData(analyser){
  let data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data
}
