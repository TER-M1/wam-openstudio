import {MainAudio, mainAudio} from "./audio_loader.js";

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

function updateCursorTracks() {
    let playHead;
    let maxPlayHead = 0;
    for (let i = 0; i < mainAudio.tracks.length; i++) {

        playHead = mainAudio.tracks[i].audioWorkletNode.playHeadPosition;
        maxPlayHead = Math.max(maxPlayHead, playHead);
        /**
         *
         * @type {HTMLCanvasElement}
         */
        let trackCanvas = mainAudio.tracks[i].canvas;

        let ctx = trackCanvas.getContext("2d");
        ctx.clearRect(0, 0, trackCanvas.width, trackCanvas.height);
        ctx.putImageData(trackCanvas.bufferState, 0, 0);

        let rapport = (playHead * 100) / mainAudio.tracks[i].operableDecodedAudioBuffer.length;
        let position = (trackCanvas.width / 100) * rapport;

        ctx.fillStyle = "lightgrey";
        ctx.fillRect(position, 0, 2, trackCanvas.height);
    }
    updateAudioTimer((maxPlayHead / 48000) * 1000);
}

function canvasClickMoveCursor(event) {
    let canvas = event.currentTarget;
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for(let i = 0; i < mainAudio.tracks.length; i++) {
        let track = mainAudio.tracks[i];

        let estimatedSeconds = x / MainAudio.PIXEL_PER_SECONDS;
        let newPlayHeadPosition = mainAudio.playHeadPositionFromTime(estimatedSeconds, track);

        if(newPlayHeadPosition >= track.operableDecodedAudioBuffer.length) {
            newPlayHeadPosition = track.operableDecodedAudioBuffer.length - 1;
        }

        track.audioWorkletNode.port.postMessage({position: newPlayHeadPosition});
    }
}

export function updateAudioTimer(playHead) {
    timerDiv.innerHTML = millisToMinutesAndSeconds(playHead);
}

export {updateCursorTracks};
export {canvasClickMoveCursor}