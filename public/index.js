import {activateMainVolume, exploreTracks} from "./src/js/PageInitialization.js";
import {onLoopBegginingInputChange, onLoopEndingInputChange, updateCursorTracks} from "./src/js/track-utils/PlayHead.js";
import {audioCtx, mainAudio} from "./src/js/audio/Utils.js";
import TrackElement from "./src/js/components/TrackElement.js";
import WaveFormElement from "./src/js/components/WaveFormElement.js";


const btnStart = document.getElementById("btn-start");
const btnApply = document.getElementById("btn-apply")
const zoomIn = document.getElementById("btn-zoom-in");
const zoomOut = document.getElementById("btn-zoom-out");
const btnRestart = document.getElementById("restart");
const inputLoop = document.getElementById("loop");
const volumeinput = document.getElementById("volume");
const inputMute = document.getElementById("mute");
const loopBeginning = document.getElementById("loop-beginning-input");
const loopEnding = document.getElementById("loop-end-input");
const startVolume = 20 / 100;
var currentPluginAudioNode;
var intervalCursorTracks = undefined;

customElements.define(
    "track-element",
    TrackElement
);

customElements.define(
    "wave-form",
    WaveFormElement
);


(async () => {
    await mainAudio.loadWam();
    btnStart.hidden = false;
    /*
    PROCESSOR INITIALIZATION
     */
    let ini
    // await audioCtx.audioWorklet.addModule("./src/js/worklet/WAMProcessor.js");
    /*
    INITIALIZATION PAGES ELEMENTS
     */
    activateMainVolume(mainAudio, startVolume);
    exploreTracks();
    /*
    EVENT LISTENERS
     */
    btnStart.playing = false;
    btnStart.onclick = () => {
        console.log(btnStart.playing);

        if (audioCtx.state === "suspended") {
            audioCtx.resume();
            if (intervalCursorTracks === undefined) {
                intervalCursorTracks = setInterval(() => {
                    updateCursorTracks();
                }, 33);
            }
        }

        if (btnStart.playing === false) {
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 1;
                if (intervalCursorTracks === undefined) {
                    intervalCursorTracks = setInterval(() => {
                        updateCursorTracks();
                    }, 33);
                }
            });
            btnStart.playing = true
        } else {
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 0;
                if (intervalCursorTracks !== undefined) {
                    updateCursorTracks();
                    clearInterval(intervalCursorTracks);
                    intervalCursorTracks = undefined;
                }
            });
            btnStart.playing = false;
        }
    }
    inputLoop.onclick = () => {
        console.log("loop pressed")
        mainAudio.tracks.forEach((track) => {
            const loop = track.audioWorkletNode.parameters.get("loop").value;
            if (loop === 1) {
                track.audioWorkletNode.parameters.get("loop").value = 0;
                inputLoop.checked = false;
            } else {
                track.audioWorkletNode.parameters.get("loop").value = 1;
                inputLoop.checked = true;
            }
        })
    };

    inputMute.onclick = () => {
        if (!mainAudio.isMuted) {
            console.log("mute");
            mainAudio.mute();
        } else {
            console.log("unmute");
            mainAudio.unMute();
        }
    };

    btnApply.onclick = () => {
        mainAudio.tracks.forEach(track => {
            //const paramId = track.bpf.querySelector('.pluginAutomationParamId').textContent;
            // console.log("paramId" + paramId);

            let list = []

            if (track.bpf !== undefined) {
                for(let x = 0; x < track.bpf.domain; x += 0.01) {
                    list.push(track.bpf.getYfromX(x));
                }
            }
            track.audioWorkletNode.port.postMessage({scheduleList: list})
        })
    }

    loopBeginning.addEventListener("change", onLoopBegginingInputChange);
    loopEnding.addEventListener("change", onLoopEndingInputChange);

})();
