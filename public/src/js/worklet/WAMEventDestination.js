import {audioCtx} from "../audio/Utils.js";
import getProcessor from "./WAMProcessor.js";
import {addFunctionModule, WebAudioModule} from "../../../lib/sdk/index.js";
import WAMAudioWorkletNode from "./WAMAudioWorkletNode.js";
//@ts-check

export default class WamEventDestination extends WebAudioModule {
    async createAudioNode(initialState) {
        await addFunctionModule(audioCtx.audioWorklet, getProcessor, this.moduleId);
        const node = new WAMAudioWorkletNode(this, {});

        return node;
    }

    async createGui() {
        const root = document.createElement('div');
        return root;
    }
}