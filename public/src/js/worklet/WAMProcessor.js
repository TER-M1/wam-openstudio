// import Module from "./CompiledProcessorModule.js";

// const sampleRate = 48000;

import {HeapAudioBuffer} from "../../../lib/wasm-audio-helper.js";

const getProcessor = (moduleId) => {
    /** @type {AudioWorkletGlobalScope} */
        // @ts-ignore
    const audioWorkletGlobalScope = globalThis;
    const {registerProcessor} = audioWorkletGlobalScope;

    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);


    class MyWAMProcessor extends ModuleScope.WamProcessor {
        /**
         *
         * @param{AudioWorkletNodeOptions} options
         */
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
                console.log(e);
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
                } else if (e.data.mod) {
                    console.log("recu")
                    console.log(e.data.mod)


                    /**
                     * IL FAUT RECEVOIR LE MODULE, ET FAIRE LE WEBASSEMBLY.INSTIANTIATE ICI
                     * MAIS JE RECOIS JAMAIS LE MESSAGE AVEC MODULE IL DISPARAIT PTN
                     */

                    this.instance = e.data.instance;
                    this._processPerf = new this.instance.processPerf;
                    this._heapInputBuffer = new HeapAudioBuffer(
                        this.instance,
                        128,
                        2,
                        32
                    );
                    this._heapOutputBuffer = new HeapAudioBuffer(
                        this.instance,
                        128,
                        2,
                        32
                    );
                }
            };
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


        _onMessage(message) {
            console.log(message);
            return super._onMessage(message);
        }


        _process(startSample, endSample, inputs, outputs, parameters) {
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

        // /**
        //  * @param {Float32Array[][]} inputs
        //  * @param {Float32Array[][]} outputs
        //  * @param {Record<string, Float32Array>} parameters
        //  */
        // process(inputs, outputs, parameters) {
        //     // If no audio detected skip then process
        //     if (!this.audio) return true;
        //
        //     // Prepare the input array
        //     let input = [];
        //     let output = outputs[0];
        //     let channelCount = this.audio.length;
        //     const channelCountMin = Math.min(this.audio.length, output.length);
        //
        //     // Slice the global audio with a RENDER_QUANTUM_FRAMES
        //     // to send the input to output by block of 128
        //     for (let i = 0; i < channelCount; i++) {
        //         input.push(
        //             this.audio[i].slice(
        //                 this.playhead - RENDER_QUANTUM_FRAMES,
        //                 this.playhead
        //             )
        //         );
        //     }
        //
        //     const bufferSize = outputs[0][0].length;
        //     const audioLength = this.audio[0].length;
        //
        //     // For this given render quantum, the channel count of the node is fixed
        //     // and identical for the input and the output.
        //
        //     // Prepare HeapAudioBuffer for the channel count change in the current
        //     // render quantum.
        //     this._heapInputBuffer.adaptChannel(channelCount);
        //     this._heapOutputBuffer.adaptChannel(channelCount);
        //
        //     // Copy-in the current block
        //     for (let channel = 0; channel < channelCount; ++channel) {
        //         this._heapInputBuffer.getChannelData(channel).set(input[channel]);
        //     }
        //     // Copy-in, process and copy-out.
        //     for (let i = 0; i < bufferSize; i++) {
        //         const playing = !!(i < parameters.playing.length
        //             ? parameters.playing[i]
        //             : parameters.playing[0]);
        //         const loop = !!(i < parameters.loop.length
        //             ? parameters.loop[i]
        //             : parameters.loop[0]);
        //         if (!playing) continue; // Not playing
        //         if (this.playhead >= this.loopEnding || this.playhead < this.loopBeggining) {
        //             // Play was finished
        //             if (loop) {
        //                 // console.log("actual beggining : " + this.loopBeggining)
        //                 this.playhead = this.loopBeggining; // Loop just enabled, reset playhead
        //             } else continue; // EOF without loop
        //         }
        //
        //         // Process the block
        //         this._processPerf.processPerf(
        //             this._heapInputBuffer.getHeapAddress(),
        //             this._heapOutputBuffer.getHeapAddress(),
        //             channelCount
        //         );
        //         // Copy-out the current block
        //         for (let channel = 0; channel < channelCountMin; ++channel) {
        //             output[channel].set(
        //                 this._heapOutputBuffer.getChannelData(channel)
        //             );
        //         }
        //         this.playhead++;
        //     }
        //     this.port.postMessage({playhead: this.playhead});
        //     return true;
        // }
    }

    try {
        registerProcessor(moduleId, MyWAMProcessor);
    } catch (e) {
        console.log(e);
    }
    return MyWAMProcessor;
}
export default getProcessor;