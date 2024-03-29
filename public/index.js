import {activateMainVolume, exploreTracks} from "./src/js/PageInitialization.js";
import {onLoopBegginingInputChange, onLoopEndingInputChange, updateCursorTracks} from "./src/js/track-utils/PlayHead.js";
import {audioCtx, mainAudio, getStartingPoint} from "./src/js/audio/Utils.js";
import TrackElement from "./src/js/components/TrackElement.js";
import WaveFormElement from "./src/js/components/WaveFormElement.js";
import PlayHeadSlider from "./src/js/components/PlayHeadSlider.js";


const btnStart = document.getElementById("btn-start");
const btnApply = document.getElementById("btn-apply");
const backToStartBtn = document.getElementById("btn-back-to-start");
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
    await audioCtx.suspend();
    btnStart.onclick = () => {
        if (audioCtx.state === "suspended") {
            if (intervalCursorTracks === undefined) {
                intervalCursorTracks = setInterval(() => {
                    updateCursorTracks();
                }, 33);
            }
        }

        if (btnStart.playing === false) {
            audioCtx.resume();
            playPauseIcon.className = "large pause icon";
            btnStart.setAttribute("data-tooltip", "Stop");
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 1;
                if (intervalCursorTracks === undefined) {
                    intervalCursorTracks = setInterval(() => {
                        updateCursorTracks();
                    }, 33);
                }
            });
            btnStart.playing = true;
            let playhead = mainAudio.tracks[0].audioWorkletNode.playHeadPosition;
            let time = (playhead / 48000) * 1000; // In milliseconds
    
            mainAudio.tracks.forEach(track => {
                track.applyAutomation(playhead, time);
            });
        } else {
            audioCtx.suspend();
            playPauseIcon.className = "large play icon";
            btnStart.setAttribute("data-tooltip", "Play");
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 0;
                if (intervalCursorTracks !== undefined) {
                    updateCursorTracks();

                    intervalCursorTracks = undefined;
                }
            });
            btnStart.playing = false;
        }
    }

    backToStartBtn.onclick = () => {
        mainAudio.tracks.forEach((track) => {
            track.audioWorkletNode.port.postMessage({reset: true});
            track.audioWorkletNode.resetPlayHead();
            updateCursorTracks();
            let playhead = mainAudio.tracks[0].audioWorkletNode.playHeadPosition;
            let time = (playhead / 48000) * 1000; // In milliseconds
    
            mainAudio.tracks.forEach(track => {
                track.applyAutomation(playhead, time);
            });
        });
    }

    inputLoop.onclick = () => {
        let looped = false;
        mainAudio.tracks.forEach((track) => {
            const loop = track.audioWorkletNode.parameters.get("loop").value;
            if (loop === 1) {
                looped = true;
                track.audioWorkletNode.parameters.get("loop").value = 0;
                inputLoop.checked = false;
            } else {
                track.audioWorkletNode.parameters.get("loop").value = 1;
                inputLoop.checked = true;
            }
        });
        if (looped) {
            inputLoop.setAttribute("data-tooltip", "Loop");
            inputLoop.style.background = "#31353A";
        }
        else {
            inputLoop.setAttribute("data-tooltip", "Unloop");
            inputLoop.style.background = "#1C1E21";
        }
    };

    inputMute.onclick = () => {
        if (!mainAudio.isMuted) {
            mainAudio.mute();
            muteIcon.className = "large volume mute icon";
        } else {
            mainAudio.unMute();
            muteIcon.className = "large volume up icon";
        }
    };

    btnApply.onclick = () => {
        let playhead = mainAudio.tracks[0].audioWorkletNode.playHeadPosition;
        let time = (playhead / 48000) * 1000; // In milliseconds

        mainAudio.tracks.forEach(track => {
            track.applyAutomation(playhead, time);
        });
    }

    loopBeginning.addEventListener("change", onLoopBegginingInputChange);
    loopEnding.addEventListener("change", onLoopEndingInputChange);

})();
