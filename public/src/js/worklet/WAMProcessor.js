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
            this.options = options;
            this.hostGroupId = undefined;
            this.groupKey = undefined;

            this.audio = null;
            /** @type {number} */
            this.playhead = 0;
            /** @type {number} */
            this.loopBeggining = 0;
            /** @type {number} */
            this.loopEnding = 0;

            this.scheduleList = []
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
                    defaultValue: 0,
                },
            ];
        }

        async _onMessage(e) {
            await super._onMessage(e);
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
            } else if (e.data.reset) {
                this.playhead = 0;
            }
            else if (e.data.delete) {
                this.audio = null;
            }
        }

        _processEvent(event) {
            this.emitEvents(event);
        }
        _process() {}

        /**
         * @param {Float32Array[][]} inputs
         * @param {Float32Array[][]} outputs
         * @param {Record<string, Float32Array>} parameters
         */
        process(inputs, outputs, parameters) {

            super.process(inputs, outputs, parameters);
            // If no audio detected skip then process
            if (!this.audio) return true;

            // Prepare the input array
            let output = outputs[0];
            // let channelCount = this.audio.length;
            const channelCountMin = Math.min(this.audio.length, output.length);

            const bufferSize = outputs[0][0].length;

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
                        this.playhead = this.loopBeggining; // Loop just enabled, reset playhead
                    } else continue; // EOF without loop
                }

                // Copy-out the current block
                for (let channel = 0; channel < channelCountMin; ++channel) {
                    output[channel][i] = this.audio[channel][this.playhead];
                }

                this.playhead++;
            }
            this.port.postMessage({playhead: this.playhead});

            return true;

        }
    }

    try {
        registerProcessor(moduleId, MyWAMProcessor);
    } catch (e) {
        // console.log(e);
    }
    return MyWAMProcessor;
}
export default getProcessor;