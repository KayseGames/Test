export const playSFX = (id, filename, ext, volume = 100, sfxEnabled = true, userInteraction = true) => {
    if (!(sfxEnabled && userInteraction)) return;

    // Check if the audio element already exists
    var audio = document.getElementById(id);
  
    // If the audio element doesn't exist, create it
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = id;
    
      // Set attributes for audio element
      audio.controls =  false; // Do not show audio controls
      audio.loop =      false; // Do not loop the audio
      audio.autoplay =  true; // Autoplay the audio
      
      // Add a source element
      const source = document.createElement('source');
      source.src = `assets/audio/${filename}.${ext}`; // Replace 'your-audio-file.mp3' with the actual path to your audio file
      source.type = 'audio/mp3';
      
      // Append source to audio element
      audio.appendChild(source);
      
      // Append audio element to the body
      document.body.appendChild(audio);
    }

    // set the volume of the audio element
    audio.volume = volume/100;

    // if the audio is playing, stop it and restart it
    !audio.paused && (audio.currentTime = 0)
    // play the audio
    audio.play();
}