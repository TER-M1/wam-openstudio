import {audioCtx, mainAudio} from "../audio/Utils.js";
import getProcessor from "./WAMProcessor.js";
import {addFunctionModule, WebAudioModule} from "../../../lib/sdk/index.js";
import WAMAudioWorkletNode from "./WAMAudioWorkletNode.js";
import {HeapAudioBuffer} from "../../../lib/wasm-audio-helper.js";
//@ts-check

export default class WamEventDestination extends WebAudioModule {
    async createAudioNode(initialState) {
        console.log(this.moduleId)
        await WAMAudioWorkletNode.addModules(this.moduleId)
        // await addFunctionModule(audioCtx.audioWorklet, getProcessor, this.moduleId);


        const node = new WAMAudioWorkletNode(this, {processorOptions: {
                moduleWasm: mainAudio.moduleWasm,
                heapInputBuffer: new HeapAudioBuffer(),
                heapOutputBuffer: new HeapAudioBuffer(),
                numberOfInputs: 1,
                numberOfOutputs: 1,
                outputChannelCount: [2],
            }});

        return node;
    }

    async createGui() {
        const root = document.createElement('div');
        return root;
    }
}