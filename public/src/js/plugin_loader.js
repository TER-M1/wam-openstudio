import {audioCtx, mainAudio} from "./audio_loader.js";


export const connectPlugin = (audioCtx, sourceNode, audioNode) => {
    sourceNode.connect(audioNode);
    audioNode.connect(audioCtx.destination);
};
const mountPlugin = (mount, domModel) => {
    mount.innerHTML = '';
    mount.appendChild(domModel);
};

async function loadPlugs() {
    const {default: initializeWamHost} = await import("../../plugins/sdk/src/initializeWamHost.js");
    var [hostGroupId] = await initializeWamHost(audioCtx);
    var {default: WAM} = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");
    console.log("initializeWamHost")
    console.log(initializeWamHost)
    // console.log("hostGroupId")
    // console.log(hostGroupId)
    console.log("WAM")
    console.log(WAM)
    for (var i = 0; i < mainAudio.tracks.length; i++) {
        // WAM.name = "plugin "+ ` ${i}`
        console.log("loading plugin " + i)
        var instance = await WAM.createInstance(hostGroupId, audioCtx);
        instance._descriptor.name = instance.name + ` ${i}`
        console.log("name : " + instance.name);

        mainAudio.tracks[i].pluginInstance = instance;
        connectPlugin(audioCtx, mainAudio.tracks[i].audioWorkletNode, instance._audioNode);
        console.log(instance);
    }
    let currentPluginAudioNode = instance._audioNode;
    connectPlugin(audioCtx, mainAudio.tracks[0].audioWorkletNode, mainAudio.masterVolumeNode);
    var pluginDomModel = await instance.createGui();
    mountPlugin(document.querySelector("#mount2"), pluginDomModel);
}
export {loadPlugs}

