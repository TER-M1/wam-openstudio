import {addFunctionModule, WamNode} from "../../../lib/sdk/index.js";
import getProcessor from "./WAMProcessor.js";
import {audioCtx} from "../audio/Utils.js";

export default class WAMAudioWorkletNode extends WamNode {
    /**
     *
     * @type {number}
     * @private
     */
    _playhead = 0;

    static async addModules(moduleId) {
        const { audioWorklet } = audioCtx;
        await super.addModules(audioCtx, moduleId);
        await addFunctionModule(audioWorklet, getProcessor, moduleId);
    }

    /**
     * @param {WebAudioModule<WAMAudioWorkletNode>} module
     * @param {AudioWorkletNodeOptions} options
     */
    constructor(module, options) {
        super(module, options);

        this._supportedEventTypes = new Set(['wam-automation']);
    }

    async _onMessage(e) {
        await super._onMessage(e);
        if (e.data.playhead) {
            this._playhead = e.data.playhead;
        }
    }

    /**
     *
     * @returns {number}
     */
    get playHeadPosition() {
        return this._playhead;
    }

    /** @param {number} position set playhead in seconds */
    setPosition(position) {
        this.port.postMessage({position});
    }

    /**
     * @param {Float32Array[][]} audio
     */
    setAudio(audio) {
        this.port.postMessage({audio});
    }

    resetPlayHead() {
        this._playhead = 0;
    }

    setPlayHeadPosition(pos) {
        this._playhead = pos;
    }

    /**
     *
     * @param {WAMAudioWorkletNode} node
     */
    setNode(node) {
        this.port.postMessage({node});
    }
}