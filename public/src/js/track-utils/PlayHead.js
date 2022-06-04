import {mainAudio} from "../audio/Utils.js";
import MainAudio from "../audio/MainAudio.js";

const timerDiv = document.querySelector(".timer");

function millisToMinutesAndSeconds(millis) {
    const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, millis)),
        parts = [
            d.getUTCHours(),
            d.getUTCMinutes(),
            d.getUTCSeconds()
        ];
    return parts.map(s => String(s).padStart(2, '0')).join(':') + "." + String(d.getMilliseconds()).padStart(3, '0');
}

export function updateCursorTracks() {
    let playHead;
    let maxPlayHead = 0;

    mainAudio.tracks.forEach(track => {
        playHead = track.audioWorkletNode.playHeadPosition;
        let loopBeggining = track.loopBeggining;
        let loopEnding = track.loopEnding;

        maxPlayHead = Math.max(maxPlayHead, playHead);
        /**
         *
         * @type {HTMLCanvasElement}
         */
        let trackCanvas = track.canvas;

        let ctx = trackCanvas.getContext("2d");
        ctx.clearRect(0, 0, trackCanvas.width, trackCanvas.height);
        ctx.putImageData(trackCanvas.bufferState, 0, 0);

        let rapportPlayHead = (playHead * 100) / track.operableDecodedAudioBuffer.length;
        let positionPlayHead = (trackCanvas.width / 100) * rapportPlayHead;
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(positionPlayHead, 0, 2, trackCanvas.height);

        let rapportLoopBeggining = (loopBeggining * 100) / track.operableDecodedAudioBuffer.length;
        let positionLoopBeggining = (trackCanvas.width / 100) * rapportLoopBeggining;
        ctx.fillStyle = "grey"
        ctx.fillRect(positionLoopBeggining, 0, 1, trackCanvas.height);

        let rapportLoopEnding = (loopEnding * 100) / track.operableDecodedAudioBuffer.length;
        let positionLoopEnding = (trackCanvas.width / 100) * rapportLoopEnding;
        ctx.fillStyle = "grey"
        ctx.fillRect(positionLoopEnding, 0, 1, trackCanvas.height);
    });
    updateAudioTimer((maxPlayHead / 48000) * 1000);
}

export function canvasClickMoveCursor(event) {
    let canvas = event.currentTarget;
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mainAudio.tracks.forEach(track => {

        let estimatedSeconds = x / MainAudio.PIXEL_PER_SECONDS;
        let newPlayHeadPosition = mainAudio.playHeadPositionFromTime(estimatedSeconds, track);

        console.log(x);

        if (newPlayHeadPosition >= track.operableDecodedAudioBuffer.length) {
            newPlayHeadPosition = track.operableDecodedAudioBuffer.length - 1;
        }
        console.log(newPlayHeadPosition);
        track.audioWorkletNode.port.postMessage({position: newPlayHeadPosition});
        track.audioWorkletNode.setPlayHeadPosition(newPlayHeadPosition);
    });
    updateCursorTracks();
}

export function updateAudioTimer(playHead) {
    timerDiv.innerHTML = millisToMinutesAndSeconds(playHead);
}

export function onLoopBegginingInputChange(event) {
    let time = event.target.value;

    mainAudio.tracks.forEach(track => {
        track.setLoopBeggining(mainAudio.playHeadPositionFromTime(time, track));
    });

    updateCursorTracks()
}

export function onLoopEndingInputChange(event) {
    let time = event.target.value;

    mainAudio.tracks.forEach(track => {
        track.setLoopEnding(mainAudio.playHeadPositionFromTime(time, track));
    });

    updateCursorTracks()
}