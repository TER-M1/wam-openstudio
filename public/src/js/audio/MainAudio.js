import {canvasClickMoveCursor} from "../track-utils/PlayHead.js";
import {drawBuffer} from "../track-utils/DrawBuffer.js";
import {initWam, mainAudio} from "./Utils.js";

export default class MainAudio {
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


    async loadWam(){
        const {hostGroupId} = await initWam()
        this.hostGroupId = hostGroupId;

        WebAssembly.compileStreaming(fetch("./src/js/worklet/ProcessWasm.wasm"))
            .then(module => {
                this.moduleWasm = module;
            });
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
     * @returns {Number}
     */
    get prevStateVolume() {
        return this.oldMasterVolume;
    }

    /**
     *
     * @param{AudioTrack} track
     * @returns {Promise<AudioTrack>}
     */
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
                // waveForm.innerHTML = `` //${waveForm.id}
                track.canvas = waveForm.canvas;
                track.bpf = waveForm.bpf;
                // track.canvas.width = MainAudio.CANVAS_WIDTH;
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
            } else if (!this.tracks[i].isSoloTrack) {
                this.tracks[i].setSoloTrack(false);
                this.tracks[i].setVolume(0);
                document.querySelector(`#track${this.tracks[i].id}`).shadowRoot.querySelector(".item.tool.solo").style.color = null;
            }
        }
    }

    unSoloTrack(track) {
        track.setVolume(0);
        track.setSoloTrack(false);
        this.checkSoloTrack();
    }

    checkSoloTrack() {
        let res = 0;
        for (let i = 0; i < this.tracks.length; i++) {
            if (this.tracks[i].isSoloTrack) {
                res++;
            }
        }
        if (!res) {
            for (let i = 0; i < this.tracks.length; i++) {
                this.tracks[i].setVolume(this.tracks[i].oldGainValue);
            }
        }
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
     * @param{number} value
     */
    saveStateVolume(value) {
        this.oldMasterVolume = value;
    }
}