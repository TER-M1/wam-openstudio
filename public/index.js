import {activateMainVolume, exploreTracks} from "./src/js/PageInitialization.js";
import {onLoopBegginingInputChange, onLoopEndingInputChange, updateCursorTracks} from "./src/js/track-utils/PlayHead.js";
import {audioCtx, mainAudio} from "./src/js/audio/Utils.js";
import TrackElement from "./src/js/components/TrackElement.js";
import WaveFormElement from "./src/js/components/WaveFormElement.js";


const btnStart = document.getElementById("btn-start");
const btnApply = document.getElementById("btn-apply");
const btnStop = document.getElementById("btn-stop");
const zoomIn = document.getElementById("btn-zoom-in");
const zoomOut = document.getElementById("btn-zoom-out");
const btnRestart = document.getElementById("restart");
const inputLoop = document.getElementById("loop");
const volumeinput = document.getElementById("volume");
const inputMute = document.getElementById("mute");
const loopBeginning = document.getElementById("loop-beginning-input");
const loopEnding = document.getElementById("loop-end-input");
const playPauseIcon = document.getElementById("btn-start-icon");
const muteIcon = document.getElementById("mute-icon");
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
    INITIALIZATION PAGES ELEMENTS
     */
    activateMainVolume(mainAudio, startVolume);
    exploreTracks();

    /*
    EVENT LISTENERS
     */
    btnStart.playing = false;
    btnStart.onclick = () => {
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
            if (intervalCursorTracks === undefined) {
                intervalCursorTracks = setInterval(() => {
                    updateCursorTracks();
                }, 33);
            }
        }

        if (btnStart.playing === false) {
            playPauseIcon.className = "large pause icon";
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 1;
                if (intervalCursorTracks === undefined) {
                    console.log("redefine");
                    intervalCursorTracks = setInterval(() => {
                        updateCursorTracks();
                    }, 33);
                }
            });
            btnStart.playing = true
        } else {
            playPauseIcon.className = "large play icon";
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

    btnStop.onclick = () => {
        btnStart.playing = false;
        mainAudio.tracks.forEach((track) => {
            track.audioWorkletNode.parameters.get("playing").value = 0;
            track.audioWorkletNode.port.postMessage({reset: true});
            track.audioWorkletNode.resetPlayHead();
            updateCursorTracks();
            clearInterval(intervalCursorTracks);
            intervalCursorTracks = undefined;
            playPauseIcon.className = "large play icon";
        })
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
            muteIcon.className = "large volume mute icon"
        } else {
            console.log("unmute");
            mainAudio.unMute();
            muteIcon.className = "large volume up icon"
        }
    };

    btnApply.onclick = () => {
        mainAudio.tracks.forEach(track => {
            let list = [];
            if (track.bpf !== undefined) {
                for(let x = 0; x < track.bpf.domain; x += 0.01) {
                    list.push(track.bpf.getYfromX(x));
                }
            }

            track.bpf.style.display = "none";
            track.audioWorkletNode.port.postMessage({
                scheduleList: list,
                hostGroupId: mainAudio.hostGroupId,
                groupKey: mainAudio.groupKey,
                wamParamId: track.bpf.paramID
            });
        })
    }

    loopBeginning.addEventListener("change", onLoopBegginingInputChange);
    loopEnding.addEventListener("change", onLoopEndingInputChange);

})();
