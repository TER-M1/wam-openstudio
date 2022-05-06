import OperableAudioBuffer from './operable-audio-buffer.js'
import {drawBuffer} from "./drawers.js";
import {canvasClickMoveCursor} from "./playhead.js";
// var WAM = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");

class MainAudio {
    /**
     *
     * @type {[AudioTrack]}
     */
    tracks = [];
    /**
     *
     * @type {boolean}
     * @private
     */
    _isMasterMuted = false;
    /**
     *
     * @type {Element}
     */
    tracksDiv = document.querySelector(".tools-tracks");
    /**
     *
     * @type {Element}
     */
    canvasDiv = document.querySelector(".audio-tracks");

    hostGroupId = undefined;

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.maxGlobalTimer = 0;
        this.masterVolumeNode = audioCtx.createGain();
        this.oldMasterVolume = this.masterVolumeNode.gain.value;
        this.masterVolumeNode.connect(this.audioCtx.destination);

    }


    addTrack(track) {
        return new Promise(async (resolve, reject) => {
            try {
                await track.load();
                this.maxGlobalTimer = Math.max(track.duration, this.maxGlobalTimer)
                track.gainOutNode.connect(this.masterVolumeNode);
                this.tracks.push(track);

                let waveForm = document.createElement("wave-form");
                track.id = this.tracks.length - 1;
                waveForm.id = "track" + track.id;
                this.canvasDiv.appendChild(waveForm);


                track.canvas = waveForm.canvas;
                track.canvas.width = this.pixelAmountFromBufferLength(track);
                track.canvas.height = MainAudio.CANVAS_HEIGHT;
                track.canvas.addEventListener("click", canvasClickMoveCursor);
                drawBuffer(track.canvas, track.decodedAudioBuffer, "#" + Math.floor(Math.random() * 16777215).toString(16));

                let trackEl = document.createElement("track-element");
                trackEl.track = track;
                trackEl.id = "track" + track.id;
                trackEl.className = `track-element`;
                this.tracksDiv.appendChild(trackEl);
                console.log(`${track.name} loaded...`);
                resolve(track);
            } catch (e) {
                reject(e);
            }
        });
    }

    removeTrack(track) {
        track.audioWorkletNode.disconnect();
        delete track.decodedAudioBuffer;
        delete track.operableDecodedAudioBuffer;
        this.tracks = this.tracks.filter((ele) => {
            return ele !== track;
        });
    }

    /**
     *
     * @returns {Number}
     */
    pixelAmountFromBufferLength(track) {
        return track.operableDecodedAudioBuffer.duration * MainAudio.PIXEL_PER_SECONDS;
    }

    /**
     *
     * @returns {Number}
     */
    playHeadPositionFromTime(time, track) {
        let rapport = track.operableDecodedAudioBuffer.length / track.operableDecodedAudioBuffer.duration;
        return rapport * time;
    }

    soloTrack(track) {
        for (let i = 0; i < this.tracks.length; i++) {
            if (track === this.tracks[i]) {
                track.setVolume(track.oldGainValue);
            } else {
                this.tracks[i].setSoloTrack(false);
                this.tracks[i].setVolume(0);
                document.querySelector(`#track${this.tracks[i].id}`).shadowRoot.querySelector(".item.tool.solo").style.color = null;
            }
        }
    }

    unSoloTracks() {
        this.tracks.forEach((track) => {
            track.setVolume(track.oldGainValue);
            track.setSoloTrack(false);
        });
    }

    /**
     *
     * @param{Number} value
     */
    setVolume(value) {
        this.masterVolumeNode.gain.value = value;
    }

    mute() {
        this._isMasterMuted = true;
        this.setVolume(0);
    }

    unMute() {
        this._isMasterMuted = false;
        this.setVolume(this.prevStateVolume);
    }

    /**
     *
     * @returns {boolean}
     */
    get isMuted() {
        return this._isMasterMuted;
    }

    /**
     *
     * @returns {number}
     */
    get volume() {
        return this.masterVolumeNode.gain.value;
    }

    /**
     *
     * @param{number} value
     */
    saveStateVolume(value) {
        this.oldMasterVolume = value;
    }

    /**
     *
     * @returns {Number}
     */
    get prevStateVolume() {
        return this.oldMasterVolume;
    }

    /**
     *
     * @returns {Number}
     */
    static get CANVAS_WIDTH() {
        return 2000;
    }

    /**
     *
     * @returns {Number}
     */
    static get CANVAS_HEIGHT() {
        return 99;
    }

    /**
     *
     * @returns {Number}
     */
    static get PIXEL_PER_SECONDS() {
        return 25;
    }
}


class AudioTrack {
    /**
     *
     * @type {OperableAudioBuffer}
     */
    operableDecodedAudioBuffer = undefined;
    /**
     *
     * @type {AudioBuffer}
     */
    decodedAudioBuffer = undefined;
    /**
     *
     * @type {Number}
     */
    duration = undefined;
    /**
     *
     * @type {boolean}
     * @private
     */
    _isMuted = false;
    /**
     *
     * @type {Element}
     */
    canvas = undefined;
    /**
     *
     * @type {boolean}
     * @private
     */
    _isSoloTrack = false;

    id = undefined;
    pluginInstance = undefined

    /**
     *
     * @param{AudioContext} audioCtx
     * @param{AudioWorkletNode} audioWorkletNode
     * @param{String} fpath
     * @param initWamHostPath
     * @param wamIndexPath
     */
    constructor(audioCtx, audioWorkletNode, fpath, initWamHostPath = "", wamIndexPath = "") {
        this.audioCtx = audioCtx;
        this.audioWorkletNode = audioWorkletNode;
        this.fpath = fpath;
        this.pannerNode = this.audioCtx.createStereoPanner();
        this.gainOutNode = this.audioCtx.createGain();
        this.oldGainValue = this.gainOutNode.gain.value;
        this.name = this.fpath.split("/").pop();
        this.initWamHostPath = initWamHostPath;
        this.wamIndexPath = wamIndexPath;
    }

    async load() {
        let response = await fetch(this.fpath);
        let audioArrayBuffer = await response.arrayBuffer();
        this.decodedAudioBuffer = await this.audioCtx.decodeAudioData(audioArrayBuffer);
        this.duration = this.decodedAudioBuffer.duration;
        this.operableDecodedAudioBuffer = Object.setPrototypeOf(
            this.decodedAudioBuffer,
            OperableAudioBuffer.prototype
        );
        this.audioWorkletNode.setAudio(this.operableDecodedAudioBuffer.toArray());
        //TODO connect plugin entre audio worlket et panner node
        this.audioWorkletNode.connect(this.pannerNode).connect(this.gainOutNode);
    }

    get isMuted() {
        return this._isMuted;
    }

    mute() {
        this.setVolume(0);
        this._isMuted = true;
    }

    unMute() {
        this._isMuted = false;
    }

    get isSoloTrack() {
        return this._isSoloTrack;
    }

    /**
     *
     * @param{Boolean} value
     */
    setSoloTrack(value) {
        this._isSoloTrack = value;
    }

    /**
     *
     * @param{Number} value
     */
    setVolume(value) {
        this.gainOutNode.gain.value = value;
    }

    /**
     *
     * @param{number} value
     */
    saveStateVolume(value) {
        this.oldGainValue = value;
    }


}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const mainAudio = new MainAudio(audioCtx);
if (audioCtx.state === "suspended") {
    audioCtx.resume();
}

const template = document.createElement("template");

template.innerHTML = /*html*/`
<script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
<script src="../../lib/semantic.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/components/icon.min.css">
<link rel="stylesheet" href="../../lib/semantic.min.css" type="text/css">

<style>

.track-element-color {
    flex-grow: 3;
    background-color: greenyellow !important;
}

.track-element-tools {
    flex-grow: 20;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.track-name {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding-top: 0.5em;
    /*flex-grow: 1;*/
    color: lightgray;
    font-family: monospace;
    font-weight: bold;
    font-size: 1.1em;
}

.ui.black.label {
    width: 150px;
    overflow     : hidden;
    text-overflow: ellipsis;
    white-space  : nowrap;
    background-color: transparent !important; 
    user-select: none;
    text-align: center;
    color: lightgrey !important;
    font-size: 13px;
}

.item.tool.close {
    padding-top: 3px;
    margin-right: 5px;
    margin-left: 2px;
    margin-bottom: 3px;
    border-radius: 5px;
}

.item.tool.close:hover {
    background-color: #3b4046 !important;
    display: flex;
}

.item.tool.close {
    flex-grow: 2; !important;
}

.track-volume, .balance {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    padding-right: 0.5em;
    padding-left: 0.5em;
    justify-content: space-around;
    align-items: center;
}

.right-icon, .left-icon, .mute-icon, .solo-icon {
    font-size: 1.3em;
    font-weight: bold;
    font-family: monospace;
    font-style: normal;
    pointer-events: none;
    user-select: none;
}

.left-icon {
    color: lightgray;
    padding-left: 2px;
    padding-right: 1px;
    user-select: none;
}

.right-icon {
    color: lightgray;
    padding-left: 1px;
    padding-right: 4px;
    user-select: none;
}

.mute-icon, .solo-icon {
    font-size: 1.3em;
    user-select: none;
}

a.item.tool.mute:link {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
}

.track-controls {
    padding-top: 0.2em;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    /*flex-grow: 6;*/
    align-items: center;
    justify-content: space-around;
}

.item.tool {
    color: grey;
}

.item.tool:hover {
    color: white;
}

a.item.menu {
    background-color: #4d5ed1 !important;
}

a.item.menu:hover {
    background-color: #4d5ed1 !important;
}

a.item.volume-slider {
    width: 15em; height: auto;
}
i.icon {
    margin: 0 !important;
}

</style>

<div class="track-element-tools">
    <div class="track-name">
        
    </div>
    <div class="track-volume">
        <i class="volume down icon"></i>
        <div class="slider track sound"><input type="range" min="0" max="1" value=".5" step=".01" class="input track sound"></div>
        <i class="volume up icon"></i>

    </div>
    <div class="balance">
        <i class="left-icon">L</i>
        <div class="track balance"><input type="range" min="-1" max="1" value="0" step=".1" class="input track balance"></div>
        <i class="right-icon">R</i>

    </div>

    <div class="track-controls">
        <a class="item tool mute">
            <i class="mute-icon">M</i>
        </a>
        <a class="item tool solo">
            <i class="mute-icon">S</i>
        </a>
<!--        <a class="item tool">-->
<!--            <i class="project diagram icon"></i>-->
<!--        </a>-->
    </div>
</div>
<div class="track-element-color"></div>


  `;

class TrackElement extends HTMLElement {
    /**
     *
     * @type {AudioTrack}
     */
    track = undefined;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }


    connectedCallback() {
        this.shadowRoot.innerHTML = template.innerHTML;
        this.fixTrackNumber();
        this.defineListeners();
        this.defineRemoveTrack();
        this.soloTrackListeners();
    }

    disconnectedCallback() {

    }

    fixTrackNumber() {
        const name = this.shadowRoot.querySelector(".track-name");
        name.id = `${this.track.id}`;
        name.innerHTML = `
        <div class="ui black label">
            ${this.track.name}
        </div>
        <a class="item tool close">
            <i class="times red icon"></i>
        </a>
        `;
    }

    defineListeners() {
        const rangeInputSound = this.shadowRoot.querySelector("input.track.sound");
        rangeInputSound.oninput = (e) => {
            if (!this.track.isMuted) {
                this.track.setVolume(rangeInputSound.value);
            }
            this.track.oldGainValue = rangeInputSound.value;
        };

        const rangeInputBalance = this.shadowRoot.querySelector("input.track.balance");
        rangeInputBalance.oninput = (e) => {
            this.track.pannerNode.pan.value = rangeInputBalance.value;
        };

        const muteTrack = this.shadowRoot.querySelector(".item.tool.mute");

        muteTrack.onclick = () => {
            if (this.track.isMuted) {
                muteTrack.style.color = null;
                this.track.gainOutNode.gain.value = this.track.oldGainValue;
                this.track.setVolume(this.track.oldGainValue);
                this.track.unMute();
            } else {
                this.track.oldGainValue = this.track.gainOutNode.gain.value;
                muteTrack.style.color = "red";
                this.track.mute();
            }
        }
    }

    defineRemoveTrack() {
        this.shadowRoot.querySelector(".item.tool.close").onclick = () => {
            document.querySelector(`.wave-form.track${this.track.id}`).remove();
            this.remove();
            mainAudio.removeTrack(this.track);
        }
    }

    soloTrackListeners() {
        let soloTrack = this.shadowRoot.querySelector(".item.tool.solo");
        soloTrack.onclick = () => {
            soloTrack.style.color = "lime";
            if (this.track.isSoloTrack) {
                this.track.setSoloTrack(false);
                soloTrack.style.color = null;
                mainAudio.unSoloTracks();
            } else {
                this.track.setSoloTrack(true);
                mainAudio.soloTrack(this.track);
            }

        }
    }
}

customElements.define(
    "track-element",
    TrackElement
);

const templateCanvas = document.createElement("template");
templateCanvas.innerHTML = /*html*/`
<canvas height="104" width="2000" class="can"></canvas>
`;


class WaveForm extends HTMLElement {
    id = undefined;
    canvas = undefined;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }


    connectedCallback() {
        this.shadowRoot.innerHTML = templateCanvas.innerHTML;
        this.defClass();
        this.defId();
    }

    disconnectedCallback() {

    }

    defClass() {
        console.log("wave-form defined")
        this.className = `wave-form ${this.id}`
    }

    defId() {
        this.canvas = this.shadowRoot.querySelector(".can");
        this.canvas.id = this.id;
    }


}

customElements.define(
    "wave-form",
    WaveForm
);


export class SimpleAudioWorkletNode extends AudioWorkletNode {
    /**
     *
     * @type {number}
     * @private
     */
    _playhead = 0;

    /**
     * @param {BaseAudioContext} context
     */
    constructor(context) {
        super(context, "simple-processor");
        this.port.onmessage = (e) => {
            if (e.data.playhead) {
                this._playhead = e.data.playhead;
            }
        }
    }

    /** @param {number} position set playhead in seconds */
    setPosition(position) {
        this.port.postMessage({position});
    }

    /**
     *
     * @returns {number}
     */
    get playHeadPosition() {
        return this._playhead;
    }

    /**
     * @param {Float32Array[][]} audio
     */
    setAudio(audio) {
        this.port.postMessage({audio});
    }
}


export {MainAudio, AudioTrack, mainAudio, audioCtx};