export default class WAMAudioWorkletNode extends AudioWorkletNode {
    /**
     *
     * @type {number}
     * @private
     */
    _playhead = 0;

    /**
     * @param {BaseAudioContext} context
     */
    constructor(context) {
        super(context, "simple-processor");
        this.port.onmessage = (e) => {
            if (e.data.playhead) {
                this._playhead = e.data.playhead;
            }
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
}