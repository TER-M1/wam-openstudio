import Module from "./CompiledProcessorModule.js";
import {HeapAudioBuffer, MAX_CHANNEL_COUNT, RENDER_QUANTUM_FRAMES,} from "../../../lib/wasm-audio-helper.js";

const sampleRate = 48000;

class SimpleProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.audio = null;
        /** @type {number} */
        this.playhead = 0;
        /** @type {number} */
        this.loopBeggining = 0;
        /** @type {number} */
        this.loopEnding = 0;

        /** @param {MessageEvent<{ audio?: Float32Array[]; position?: number;}>} e */
        this.port.onmessage = (e) => {
            if (e.data.audio) {
                this.audio = e.data.audio;
            } else if (e.data.position && typeof e.data.position === "number") {
                this.playhead = e.data.position; // * sampleRate;
                this.port.postMessage({playhead: this.playhead})
            } else if (e.data.loopBeggining && typeof e.data.loopBeggining === "number") {
                if (e.data.loopBeggining === -1)
                    this.loopBeggining = 0;
                else
                    this.loopBeggining = e.data.loopBeggining;
            } else if (e.data.loopEnding && typeof e.data.loopEnding === "number") {
                if (e.data.loopEnding === -1)
                    this.loopEnding = this.audio[0].length;
                else
                    this.loopEnding = e.data.loopEnding;
            }
        };
        this._heapInputBuffer = new HeapAudioBuffer(
            Module,
            RENDER_QUANTUM_FRAMES,
            2,
            MAX_CHANNEL_COUNT
        );
        this._heapOutputBuffer = new HeapAudioBuffer(
            Module,
            RENDER_QUANTUM_FRAMES,
            2,
            MAX_CHANNEL_COUNT
        );

        this._processPerf = new Module.ProcessorPerf();
    }

    /** @type {AudioParamDescriptor[]} */
    static get parameterDescriptors() {
        return [
            {
                name: "playing",
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
            },
            {
                name: "loop",
                minValue: 0,
                maxValue: 1,
                defaultValue: 1,
            },
        ];
    }

    /**
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     * @param {Record<string, Float32Array>} parameters
     */
    process(inputs, outputs, parameters) {
        // If no audio detected skip then process
        if (!this.audio) return true;

        // Prepare the input array
        let input = [];
        let output = outputs[0];
        let channelCount = this.audio.length;
        const channelCountMin = Math.min(this.audio.length, output.length);

        // Slice the global audio with a RENDER_QUANTUM_FRAMES
        // to send the input to output by block of 128
        for (let i = 0; i < channelCount; i++) {
            input.push(
                this.audio[i].slice(
                    this.playhead - RENDER_QUANTUM_FRAMES,
                    this.playhead
                )
            );
        }

        const bufferSize = outputs[0][0].length;
        const audioLength = this.audio[0].length;

        // For this given render quantum, the channel count of the node is fixed
        // and identical for the input and the output.

        // Prepare HeapAudioBuffer for the channel count change in the current
        // render quantum.
        this._heapInputBuffer.adaptChannel(channelCount);
        this._heapOutputBuffer.adaptChannel(channelCount);

        // Copy-in the current block
        for (let channel = 0; channel < channelCount; ++channel) {
            this._heapInputBuffer.getChannelData(channel).set(input[channel]);
        }
        // Copy-in, process and copy-out.
        for (let i = 0; i < bufferSize; i++) {
            const playing = !!(i < parameters.playing.length
                ? parameters.playing[i]
                : parameters.playing[0]);
            const loop = !!(i < parameters.loop.length
                ? parameters.loop[i]
                : parameters.loop[0]);
            if (!playing) continue; // Not playing
            if (this.playhead >= this.loopEnding || this.playhead < this.loopBeggining) {
                // Play was finished
                if (loop) {
                    // console.log("actual beggining : " + this.loopBeggining)
                    this.playhead = this.loopBeggining; // Loop just enabled, reset playhead
                } else continue; // EOF without loop
            }

            // Process the block
            this._processPerf.processPerf(
                this._heapInputBuffer.getHeapAddress(),
                this._heapOutputBuffer.getHeapAddress(),
                channelCount
            );
            // Copy-out the current block
            for (let channel = 0; channel < channelCountMin; ++channel) {
                output[channel].set(
                    this._heapOutputBuffer.getChannelData(channel)
                );
            }
            this.playhead++;
        }
        this.port.postMessage({playhead: this.playhead});
        return true;
    }
}

registerProcessor("simple-processor", SimpleProcessor);
