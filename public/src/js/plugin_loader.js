import {audioCtx, mainAudio} from "./audio_loader.js";
import {connectPlugin} from "./plugin_parameters.js";



class PluginLoader {

     constructor() {
        this.instanciatePlugins();

    }

    async instanciatePlugins(){

       //  const {default: initializeWamHost} = await import("../../plugins/testBern/utils/sdk/src/initializeWamHost.js");
       //  var [hostGroupId] = await initializeWamHost(audioCtx);
       //  var {default: WAM} = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");
       //  console.log("initializeWamHost")
       //  console.log(initializeWamHost)
       //  console.log("hostGroupId")
       //  console.log(hostGroupId)
       //  console.log("WAM")
       //  console.log(WAM)
       //  for(var i = 0 ; i < mainAudio.tracks.length; i++){
       //      console.log("loading plugin " + i)
       //     let instance = await WAM.createInstance(hostGroupId, audioCtx);
       //     mainAudio.tracks[i].pluginInstance = instance;
       //     connectPlugin(audioCtx, mainAudio.tracks[i].audioWorkletNode, instance._audioNode);
       //     console.log(instance);
       // }

        const {default: initializeWamHost} = await import("../../plugins/testBern/utils/sdk/src/initializeWamHost.js");
        var [hostGroupId] = await initializeWamHost(audioCtx);
        var {default: WAM} = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");
        console.log("initializeWamHost")
        console.log(initializeWamHost)
        console.log("hostGroupId")
        console.log(hostGroupId)
        console.log("WAM")
        console.log(WAM)
        // for(var i = 0 ; i < mainAudio.tracks.length; i++){
        //     console.log("loading plugin " + i)
        var instance = await WAM.createInstance(hostGroupId, audioCtx);
        mainAudio.tracks[0].pluginInstance = instance;
        connectPlugin(audioCtx, mainAudio.tracks[0].audioWorkletNode, instance._audioNode);
        console.log(instance);
        // }
        let currentPluginAudioNode = instance._audioNode;
        connectPlugin(audioCtx, mainAudio.tracks[0].audioWorkletNode, mainAudio.masterVolumeNode);
        var pluginDomModel = await instance.createGui();
        mountPlugin(document.querySelector("#mount2"), pluginDomModel);


    }
}
export {PluginLoader}

