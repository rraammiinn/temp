


class VoiceRecorder{
  constructor(onstart,onstop,onresume,onpause){
        this.onstart=onstart
        this.onstop=onstop
        this.onresume=onresume
        this.onpause=onpause
        this.chunks=[];
        this.mediaRecorder=null;
        console.log('///',this)

    }
    
    startRecording() {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true,},).then((stream) => {
      
            this.mediaRecorder = new MediaRecorder(stream);
      
            this.mediaRecorder.onstop = (e) => {
              const blob = new Blob(this.chunks, { type: "audio/mp3; codecs=mp3" });
              const file = new File([blob],'voice.mp3',{ type: 'audio/mp3' })
              this.onstop(file)
        }
      
        this.mediaRecorder.onpause = ()=>{this.onpause()}
      
        this.mediaRecorder.onresume = ()=>{this.onresume()}
      
      
            this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
      };
      this.chunks=[];
      this.mediaRecorder.start();
      this.onstart()
          })
      
 
      }

    }
    
    stopRecording() {
      this.mediaRecorder.stop();
    }
    
    pauseRecording() {
      this.mediaRecorder.pause();
    }
    
    resumeRecording() {
      this.mediaRecorder.resume();
    }
}

export {VoiceRecorder}