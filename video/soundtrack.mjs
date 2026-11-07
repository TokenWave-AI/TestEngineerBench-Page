// Original synthesized score and interface cues; no third-party audio samples.
import {writeFileSync} from 'node:fs';
export function writeSoundtrack(path,duration=45){
 const rate=48000,count=Math.ceil(duration*rate),left=new Float32Array(count),right=new Float32Array(count);
 let seed=319;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const note=(midi)=>440*2**((midi-69)/12);
 function tone(start,length,midi,amp,pan=0,kind='key'){
  const first=Math.round(start*rate),n=Math.min(Math.ceil(length*rate),count-first),hz=note(midi);
  for(let i=0;i<n;i++){
   const t=i/rate,fade=Math.min(1,t/.025)*Math.min(1,(length-t)/.14);
   const wave=kind==='pad'?(Math.sin(2*Math.PI*hz*t)+.17*Math.sin(2*Math.PI*hz*1.002*t))*.65:Math.sin(2*Math.PI*hz*t)*Math.exp(-t*2.6)+.24*Math.sin(2*Math.PI*hz*2*t)*Math.exp(-t*6)+.08*Math.sin(2*Math.PI*hz*3.003*t)*Math.exp(-t*10);
   const value=wave*fade*amp;left[first+i]+=value*(1-pan*.35);right[first+i]+=value*(1+pan*.35);
  }
 }
 const chords=[[53,57,60,64],[50,53,57,60],[46,50,53,57],[48,55,60,62],[53,57,60,64],[50,53,57,64],[46,50,53,60],[48,55,60,64],[53,57,60,65]];
 chords.forEach((chord,bar)=>{
  chord.forEach((m,i)=>tone(bar*5,5.4,m,.013,(i-1.5)/2,'pad'));
  for(let beat=0;beat<8;beat++){const pos=bar*5+beat*.625;if(pos<duration-2){tone(pos,1.4,chord[[0,2,1,3,2,1,3,2][beat]]+12,.052,beat%2?-.4:.4);if(beat%4===0)tone(pos,2.1,chord[0]-12,.046,0);}}
 });
 function click(start,amplitude=.018){const first=Math.round(start*rate);for(let i=0;i<rate*.045&&first+i<count;i++){const t=i/rate,v=(random()*2-1)*Math.exp(-t*100)*amplitude;left[first+i]+=v;right[first+i]+=v*.85;}}
 for(let t=.8;t<2.8;t+=.075)click(t,.008);
 for(let t=15.5;t<18.8;t+=.07)click(t,.006);
 [4,8,13,20.5,23.0,26,33,39].forEach(t=>{click(t,.025);tone(t,.5,77,.065,-.2);tone(t+.07,.7,84,.035,.2);});
 tone(41.5,2.8,77,.07,-.3);tone(41.65,2.6,81,.05,.3);tone(41.8,2.5,84,.035,0);
 let peak=0;for(let i=0;i<count;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
 const gain=Math.min(10**(8/20),.7/Math.max(peak,.001)),pcm=Buffer.alloc(count*4);
 for(let i=0;i<count;i++){const t=i/rate,fade=Math.min(1,t/.25)*Math.min(1,(duration-t)/1.8);pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,left[i]*gain*fade))*32767),i*4);pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,right[i]*gain*fade))*32767),i*4+2);}
 const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);writeFileSync(path,Buffer.concat([header,pcm]));
}
