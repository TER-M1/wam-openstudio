import {audioCtx, AudioTrack, mainAudio, SimpleAudioWorkletNode} from "./audio_loader.js";
import {Selector} from "./listener.js";

export const connectPlugin = (audioCtx, sourceNode, audioNode) => {
    sourceNode.connect(audioNode);
    audioNode.connect(audioCtx.destination);
};
const mountPlugin = (mount,domModel) => {
    mount.innerHTML = '';
    mount.appendChild(domModel);
};
async function loadPlugs() {
    const initializeWamHost = await import("../../plugins/testBern/utils/sdk/src/initializeWamHost.js");
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

export function activateMainVolume(mainAudio, val) {
    mainAudio.setVolume(val);
    mainAudio.saveStateVolume(val);
    $('.master').slider({
        start: 20,
        value: 20,
        range: 'max',
        min: 0,
        max: 100,
        smooth: true,
        onMove: function (value) {
            let val = value / 100;
            if (!mainAudio.isMuted) {
                mainAudio.setVolume(val);
            }
            mainAudio.saveStateVolume(val);
        }
    });
}

export function exploreTracks() {
    fetch('http://localhost:80/track')
        .then(res => res.json())
        .then((output) => {

            let values = output.tracks
                .map(track => ({
                    name: track.trackname,
                    value: track.id,
                    class: `item multitrack-item${track.id}`,
                }));

            $('.ui.dropdown.add-multitrack').dropdown({
                action: 'hide',
                values: values
            });
            attachControl(values);
        })
        .catch(err => console.log(err));

}


function attachControl(values) {
    values.forEach(value => {
        let el = document.querySelector('.item.multitrack-item'+value.value);
        el.addEventListener('click', () => {
            let asyncAddTrack = [];
            fetch('http://localhost:80/track/'+value.value)
                .then(res => res.json())
                .then(async (output) => {
                    let soundList = output.soundList;
                    for (let i = 0; i < soundList.length; i++) {
                        let path = `${output.path}/${soundList[i].name}`
                        asyncAddTrack.push(mainAudio.addTrack(
                            new AudioTrack(audioCtx, new SimpleAudioWorkletNode(audioCtx), path)
                        ));
                    }
                    let res = await Promise.all(
                        asyncAddTrack
                    )
                    const selector = new Selector(mainAudio.tracks);
                    loadPlugs()
                    // const pluginLoader = new PluginLoader();
                })
                .catch(err => console.log(err));


        })
    })



}
