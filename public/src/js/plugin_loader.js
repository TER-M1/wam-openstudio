import {audioCtx, mainAudio} from "./audio_loader.js";



class PluginLoader {
     constructor() {
        this.instanciatePlugins();

    }

    async instanciatePlugins(){

        var {default: WAM} = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");
        const {default: initializeWamHost} = await import("../../plugins/testBern/utils/sdk/src/initializeWamHost.js");
        var [hostGroupId] = await initializeWamHost(audioCtx);
        for(var i = 0 ; i < mainAudio.tracks.length; i++){
           let instance = await WAM.createInstance(hostGroupId, audioCtx);
           mainAudio.tracks[i].pluginInstance = instance;
           connectPlugin(audioCtx, mainAudio.tracks[i].audioWorkletNode, instance._audioNode);

       }


    }
}
export {PluginLoader}