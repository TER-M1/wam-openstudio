import {audioCtx, mainAudio} from "./audio_loader.js";


export const connectPlugin = (audioCtx, sourceNode, audioNode) => {
    sourceNode.connect(audioNode);
    audioNode.connect(audioCtx.destination);
};

async function loadPlugs() {
    const {default: initializeWamHost} = await import("../../sdk/src/initializeWamHost.js");
    var [hostGroupId] = await initializeWamHost(audioCtx);
    var {default: WAM} = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");
    for (var i = 0; i < mainAudio.tracks.length; i++) {
        console.log("loading plugin " + i)
        var instance = await WAM.createInstance(hostGroupId, audioCtx);
        instance._descriptor.name = instance.name + ` ${i}`
        mainAudio.tracks[i].pluginInstance = instance;
        mainAudio.tracks[i].pluginDOM = await instance.createGui();
        connectPlugin(audioCtx, mainAudio.tracks[i].audioWorkletNode, instance._audioNode);
    }
}
export {loadPlugs}

