import OperableAudioBuffer from "./OperableAudioBuffer.js";
import {audioCtx, getStartingPoint, mainAudio} from "./Utils.js";
import {populateDropDown} from "../track-utils/TrackSelector.js";

export default class AudioTrack {
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
     * @type {Element}
     */
    canvas = undefined;
    /**
     *
     * @type {Element}
     */
    currentBpf = undefined;
    id = undefined;
    pluginInstance = undefined;
    pluginDOM = undefined;

    /**
     *
     * @param {AudioContext} audioCtx
     * @param {import("../../../lib/sdk").WamNode} audioWorkletNode
     * @param {string} fpath
     * @param {string} initWamHostPath
     * @param {string} wamIndexPath
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
        this.loopBeggining = 0;
        this.loopEnding = 0;
        this.bpfList = [];
        this.bpfContainer = undefined;
        this.hasPlugin = false;
    }

    /**
     *
     * @type {boolean}
     * @private
     */
    _isMuted = false;

    get isMuted() {
        return this._isMuted;
    }

    /**
     *
     * @type {boolean}
     * @private
     */
    _isSoloTrack = false;

    get isSoloTrack() {
        return this._isSoloTrack;
    }

    addBPF(bpf) {
        if (!this.bpfList.includes(bpf)) {
            this.bpfList.push(bpf);
        }
    }

    removeBPF(bpf) {
        let index = this.bpfList.indexOf(bpf);
        this.bpfList.splice(index, 1);
    }

    getBPF(bpfParamID) {
        let selected = null;
        this.bpfList.forEach((bpf) => {
            if (bpf.paramID === bpfParamID) {
                selected = bpf;
            }
        });
        return selected
    }

    hasBPF(bpfParamID) {
        let isPresent = false;
        this.bpfList.forEach((bpf) => {
            if (bpf.paramID === bpfParamID) {
                isPresent = true;
            }
        });
        return isPresent;
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
        this.setLoopEnding(this.decodedAudioBuffer.length);
        this.audioWorkletNode.setAudio(this.operableDecodedAudioBuffer.toArray());
        this.audioWorkletNode.connect(this.pannerNode).connect(this.gainOutNode);
    }

    async addPedalBoard() {
        this.hasPlugin = true;
        var {default: WAM} = await import ("https://wam-bank.vidalmazuy.fr/src/index.js");
        var instance = await WAM.createInstance(mainAudio.hostGroupId, audioCtx);

        this.pluginInstance = instance;
        this.pluginDOM = await instance.createGui();
        this.audioWorkletNode.disconnect(this.pannerNode);
        this.audioWorkletNode.connect(this.pluginInstance._audioNode).connect(this.pannerNode);
        this.audioWorkletNode.port.postMessage({plugin: this.pluginInstance._groupId});

        let mount = document.querySelector("#mount1");
        mount.innerHTML = '';
        mount.appendChild(this.pluginDOM);
        populateDropDown(this, this.bpfContainer, document.querySelector('.ui.dropdown.auto'));
    }

    async removePedalBoard() {
        this.hasPlugin = false;
        this.audioWorkletNode.disconnect(this.pluginInstance._audioNode);
        this.audioWorkletNode.connect(this.pannerNode);

        this.pluginInstance._audioNode = null;
        this.pluginDOM = null;

        let mount = document.querySelector("#mount1");
        mount.innerHTML = '';
    }

    async applyAutomation(playhead, time) {
        let maxDuration = this.duration*1000; // convert seconds in milliseconds
        await this.audioWorkletNode.clearEvents();
        // track.audioWorkletNode.clearEvents();
        let events = [];
        this.bpfList.forEach(bpf => {
            let list = [];

            if (bpf !== undefined) {
                for(let x = 0; x < bpf.domain; x += 0.1) {
                    list.push(bpf.getYfromX(x));
                }
                let start = getStartingPoint(maxDuration, time, list.length);
                let wamParamId = bpf.paramID;

                let t = 0;
                for (let i = start; i < list.length; i++) {
                    events.push({ type: 'wam-automation', data: { id: wamParamId, value: list[i] }, time: this.audioCtx.currentTime + t })
                    t += 0.1;
                }
            }
        });
        events.sort((a, b) => a.time - b.time);
        this.audioWorkletNode.scheduleEvents(...events);
    }

    mute() {
        this.setVolume(0);
        this._isMuted = true;
    }

    unMute() {
        this._isMuted = false;
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

    /**
     *
     * @param{number} value
     */
    setLoopBeggining(value) {
        if (!isNaN(value) && value >= 0 && value < this.operableDecodedAudioBuffer.length && value < this.loopEnding)
            this.loopBeggining = value;
        else
            this.loopBeggining = 1;

        this.audioWorkletNode.port.postMessage({loopBeggining: this.loopBeggining});
    }

    /**
     *
     * @param{number} value
     */
    setLoopEnding(value) {
        if (!isNaN(value) && value >= 0 && value <= this.operableDecodedAudioBuffer.length && value > this.loopBeggining)
            this.loopEnding = value;
        else
            this.loopEnding = this.operableDecodedAudioBuffer.length;

        this.audioWorkletNode.port.postMessage({loopEnding: this.loopEnding});
    }
}