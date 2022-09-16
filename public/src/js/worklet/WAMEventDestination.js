import {mainAudio} from "../audio/Utils.js";
import {WebAudioModule} from "../../../lib/sdk/index.js";
import WAMAudioWorkletNode from "./WAMAudioWorkletNode.js";

export default class WamEventDestination extends WebAudioModule {
    async createAudioNode(initialState) {
        await WAMAudioWorkletNode.addModules(this.moduleId)

        const node = new WAMAudioWorkletNode(
            this,
            {
                processorOptions: {
                    moduleWasm: mainAudio.moduleWasm,
                    numberOfInputs: 1,
                    numberOfOutputs: 1,
                    outputChannelCount: [2],
                    useSab: true
                }
            });

        await node._initialize();
        return node;
    }

    async createGui() {
        const root = document.createElement('div');
        return root;
    }
}