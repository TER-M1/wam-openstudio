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
        // super(context, "wam-processor");
        options.processorOptions = {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [2],
            // useSab: true,
        };
        super(module, options);
        this.port.onmessage = (e) => {
            if (e.data.playhead) {
                this._playhead = e.data.playhead;
            }
        }
        this._supportedEventTypes = new Set(['wam-automation']);
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
}