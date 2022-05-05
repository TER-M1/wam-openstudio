import {audioCtx, AudioTrack, mainAudio, SimpleAudioWorkletNode} from "./audio_loader.js";
import {Selector} from "./listener.js";
import {PluginLoader} from "./plugin_loader.js";


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
                    const pluginLoader = new PluginLoader();
                })
                .catch(err => console.log(err));


        })
    })



}
