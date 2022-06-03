import OperableAudioBuffer from "./OperableAudioBuffer.js";
import {audioCtx, mainAudio} from "./Utils.js";

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
    bpf = undefined;
    id = undefined;
    pluginInstance = undefined;
    pluginDOM = undefined;

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
        this.loopBeggining = 0;
        this.loopEnding = 0;
        this.bpfList = [];
        this.bpfContainer = undefined;
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
        var {default: WAM} = await import ("../../../plugins/pedalboard/index.js");
        var instance = await WAM.createInstance(mainAudio.hostGroupId, audioCtx);
        instance._descriptor.name = instance.name + ` ${this.id}`
        this.pluginInstance = instance;
        this.pluginDOM = await instance.createGui();

        console.log(this.pluginInstance)

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
        this.audioWorkletNode.connect(this.pluginInstance._audioNode).connect(this.pannerNode).connect(this.gainOutNode);
        this.audioWorkletNode.port.postMessage({plugin: this.pluginInstance._groupId})
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