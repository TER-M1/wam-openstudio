
/*
Code generated with Faust version 2.38.16
Compilation options: -lang wasm-ib -cn testBernard -es 1 -mcd 16 -single -ftz 2 
*/

function getJSONtestBernard() {
	return '{"name": "testBernard","filename": "testBernard.dsp","version": "2.38.16","compile_options": "-lang wasm-ib -cn testBernard -es 1 -mcd 16 -single -ftz 2 ","include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/tmp/sessions/9D378428D465949D549A319FF77911458035A62E/web/wap"],"size": 74936,"inputs": 2,"outputs": 2,"meta": [ { "author": "Grame" },{ "basics_lib_bypass2_author": "Julius Smith" },{ "basics_lib_name": "Faust Basic Element Library" },{ "basics_lib_version": "0.4" },{ "compilation_options": "-single -scal -I libraries/ -I project/ -lang wasm" },{ "compile_options": "-lang wasm-ib -cn testBernard -es 1 -mcd 16 -single -ftz 2 " },{ "copyright": "(c) GRAME 2006 and MoForte Inc. 2017" },{ "designer": "Robert A. Moog" },{ "filename": "testBernard.dsp" },{ "library_path0": "/libraries/stdfaust.lib" },{ "library_path1": "/libraries/basics.lib" },{ "library_path2": "/libraries/routes.lib" },{ "license": "BSD" },{ "name": "testBernard" },{ "reference": "https://ccrma.stanford.edu/~jos/pasp/Freeverb.html" },{ "routes_lib_name": "Faust Signal Routing Library" },{ "routes_lib_version": "0.2" },{ "version": "1.0" }],"ui": [ {"type": "hgroup","label": "testBernard","items": [ {"type": "hgroup","label": "Effects","meta": [{ "1": "" }],"items": [ {"type": "hgroup","label": "Reverb","meta": [{ "7": "" }],"items": [ {"type": "vgroup","label": "Knobs","meta": [{ "0": "" }],"items": [ {"type": "vslider","label": "Damp","address": "/testBernard/Effects/Reverb/Knobs/Damp","index": 12,"meta": [{ "midi": "ctrl 3" },{ "style": "knob" }],"init": 0.5,"min": 0,"max": 1,"step": 0.025},{"type": "vslider","label": "RoomSize","address": "/testBernard/Effects/Reverb/Knobs/RoomSize","index": 8,"meta": [{ "midi": "ctrl 4" },{ "style": "knob" }],"init": 0.5,"min": 0,"max": 1,"step": 0.025},{"type": "vslider","label": "Wet","address": "/testBernard/Effects/Reverb/Knobs/Wet","index": 4,"meta": [{ "midi": "ctrl 2" },{ "style": "knob" }],"init": 0.3333,"min": 0,"max": 1,"step": 0.025}]},{"type": "vgroup","label": "Switches","meta": [{ "1": "" }],"items": [ {"type": "checkbox","label": "Enable","address": "/testBernard/Effects/Reverb/Switches/Enable","index": 0,"meta": [{ "0": "" },{ "midi": "ctrl 105" }]}]}]}]}]}]}';
}
function getBase64CodetestBernard() { return "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c3RCZXJuYXJkIC1lcyAxIC1tY2QgMTYgLXNpbmdsZSAtZnR6IDIgIiB9LHsgImNvcHlyaWdodCI6ICIoYykgR1JBTUUgMjAwNiBhbmQgTW9Gb3J0ZSBJbmMuIDIwMTciIH0seyAiZGVzaWduZXIiOiAiUm9iZXJ0IEEuIE1vb2ciIH0seyAiZmlsZW5hbWUiOiAidGVzdEJlcm5hcmQuZHNwIiB9LHsgImxpYnJhcnlfcGF0aDAiOiAiL2xpYnJhcmllcy9zdGRmYXVzdC5saWIiIH0seyAibGlicmFyeV9wYXRoMSI6ICIvbGlicmFyaWVzL2Jhc2ljcy5saWIiIH0seyAibGlicmFyeV9wYXRoMiI6ICIvbGlicmFyaWVzL3JvdXRlcy5saWIiIH0seyAibGljZW5zZSI6ICJCU0QiIH0seyAibmFtZSI6ICJ0ZXN0QmVybmFyZCIgfSx7ICJyZWZlcmVuY2UiOiAiaHR0cHM6Ly9jY3JtYS5zdGFuZm9yZC5lZHUvfmpvcy9wYXNwL0ZyZWV2ZXJiLmh0bWwiIH0seyAicm91dGVzX2xpYl9uYW1lIjogIkZhdXN0IFNpZ25hbCBSb3V0aW5nIExpYnJhcnkiIH0seyAicm91dGVzX2xpYl92ZXJzaW9uIjogIjAuMiIgfSx7ICJ2ZXJzaW9uIjogIjEuMCIgfV0sInVpIjogWyB7InR5cGUiOiAiaGdyb3VwIiwibGFiZWwiOiAidGVzdEJlcm5hcmQiLCJpdGVtcyI6IFsgeyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIkVmZmVjdHMiLCJtZXRhIjogW3sgIjEiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJoZ3JvdXAiLCJsYWJlbCI6ICJSZXZlcmIiLCJtZXRhIjogW3sgIjciOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJLbm9icyIsIm1ldGEiOiBbeyAiMCI6ICIiIH1dLCJpdGVtcyI6IFsgeyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJEYW1wIiwiYWRkcmVzcyI6ICIvdGVzdEJlcm5hcmQvRWZmZWN0cy9SZXZlcmIvS25vYnMvRGFtcCIsImluZGV4IjogMTIsIm1ldGEiOiBbeyAibWlkaSI6ICJjdHJsIDMiIH0seyAic3R5bGUiOiAia25vYiIgfV0sImluaXQiOiAwLjUsIm1pbiI6IDAsIm1heCI6IDEsInN0ZXAiOiAwLjAyNX0seyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJSb29tU2l6ZSIsImFkZHJlc3MiOiAiL3Rlc3RCZXJuYXJkL0VmZmVjdHMvUmV2ZXJiL0tub2JzL1Jvb21TaXplIiwiaW5kZXgiOiA4LCJtZXRhIjogW3sgIm1pZGkiOiAiY3RybCA0IiB9LHsgInN0eWxlIjogImtub2IiIH1dLCJpbml0IjogMC41LCJtaW4iOiAwLCJtYXgiOiAxLCJzdGVwIjogMC4wMjV9LHsidHlwZSI6ICJ2c2xpZGVyIiwibGFiZWwiOiAiV2V0IiwiYWRkcmVzcyI6ICIvdGVzdEJlcm5hcmQvRWZmZWN0cy9SZXZlcmIvS25vYnMvV2V0IiwiaW5kZXgiOiA0LCJtZXRhIjogW3sgIm1pZGkiOiAiY3RybCAyIiB9LHsgInN0eWxlIjogImtub2IiIH1dLCJpbml0IjogMC4zMzMzLCJtaW4iOiAwLCJtYXgiOiAxLCJzdGVwIjogMC4wMjV9XX0seyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIlN3aXRjaGVzIiwibWV0YSI6IFt7ICIxIjogIiIgfV0sIml0ZW1zIjogWyB7InR5cGUiOiAiY2hlY2tib3giLCJsYWJlbCI6ICJFbmFibGUiLCJhZGRyZXNzIjogIi90ZXN0QmVybmFyZC9FZmZlY3RzL1JldmVyYi9Td2l0Y2hlcy9FbmFibGUiLCJpbmRleCI6IDAsIm1ldGEiOiBbeyAiMCI6ICIiIH0seyAibWlkaSI6ICJjdHJsIDEwNSIgfV19XX1dfV19XX1dfQ=="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

if (typeof (AudioWorkletNode) === "undefined") {
    alert("AudioWorklet is not supported in this browser !")
}

class testBernardNode extends AudioWorkletNode {

    constructor(context, baseURL, options) {
        super(context, 'testBernard', options);

        this.baseURL = baseURL;
        this.json = options.processorOptions.json;
        this.json_object = JSON.parse(this.json);

        // JSON parsing functions
        this.parse_ui = function (ui, obj) {
            for (var i = 0; i < ui.length; i++) {
                this.parse_group(ui[i], obj);
            }
        }

        this.parse_group = function (group, obj) {
            if (group.items) {
                this.parse_items(group.items, obj);
            }
        }

        this.parse_items = function (items, obj) {
            for (var i = 0; i < items.length; i++) {
                this.parse_item(items[i], obj);
            }
        }

        this.parse_item = function (item, obj) {
            if (item.type === "vgroup"
                || item.type === "hgroup"
                || item.type === "tgroup") {
                this.parse_items(item.items, obj);
            } else if (item.type === "hbargraph"
                || item.type === "vbargraph") {
                // Keep bargraph adresses
                obj.outputs_items.push(item.address);
            } else if (item.type === "vslider"
                || item.type === "hslider"
                || item.type === "button"
                || item.type === "checkbox"
                || item.type === "nentry") {
                // Keep inputs adresses
                obj.inputs_items.push(item.address);
                obj.descriptor.push(item);
                // Decode MIDI
                if (item.meta !== undefined) {
                    for (var i = 0; i < item.meta.length; i++) {
                        if (item.meta[i].midi !== undefined) {
                            if (item.meta[i].midi.trim() === "pitchwheel") {
                                obj.fPitchwheelLabel.push({
                                    path: item.address,
                                    min: parseFloat(item.min),
                                    max: parseFloat(item.max)
                                });
                            } else if (item.meta[i].midi.trim().split(" ")[0] === "ctrl") {
                                obj.fCtrlLabel[parseInt(item.meta[i].midi.trim().split(" ")[1])]
                                    .push({
                                        path: item.address,
                                        min: parseFloat(item.min),
                                        max: parseFloat(item.max)
                                    });
                            }
                        }
                    }
                }
                // Define setXXX/getXXX, replacing '/c' with 'C' everywhere in the string
                var set_name = "set" + item.address;
                var get_name = "get" + item.address;
                set_name = set_name.replace(/\/./g, (x) => { return x.substr(1, 1).toUpperCase(); });
                get_name = get_name.replace(/\/./g, (x) => { return x.substr(1, 1).toUpperCase(); });
                obj[set_name] = (val) => { obj.setParamValue(item.address, val); };
                obj[get_name] = () => { return obj.getParamValue(item.address); };
                //console.log(set_name);
                //console.log(get_name);
            }
        }

        this.output_handler = null;

        // input/output items
        this.inputs_items = [];
        this.outputs_items = [];
        this.descriptor = [];

        // MIDI
        this.fPitchwheelLabel = [];
        this.fCtrlLabel = new Array(128);
        for (var i = 0; i < this.fCtrlLabel.length; i++) { this.fCtrlLabel[i] = []; }

        // Parse UI
        this.parse_ui(this.json_object.ui, this);

        // Set message handler
        this.port.onmessage = this.handleMessage.bind(this);
        try {
            if (this.parameters) this.parameters.forEach(p => p.automationRate = "k-rate");
        } catch (e) { }
    }

    // To be called by the message port with messages coming from the processor
    handleMessage(event) {
        var msg = event.data;
        if (this.output_handler) {
            this.output_handler(msg.path, msg.value);
        }
    }

    // Public API

    /**
     * Destroy the node, deallocate resources.
     */
    destroy() {
        this.port.postMessage({ type: "destroy" });
        this.port.close();
    }

    /**
     *  Returns a full JSON description of the DSP.
     */
    getJSON() {
        return this.json;
    }

    // For WAP
    async getMetadata() {
        return new Promise(resolve => {
            let real_url = (this.baseURL === "") ? "main.json" : (this.baseURL + "/main.json");
            fetch(real_url).then(responseJSON => {
                return responseJSON.json();
            }).then(json => {
                resolve(json);
            })
        });
    }

    /**
     *  Set the control value at a given path.
     *
     * @param path - a path to the control
     * @param val - the value to be set
     */
    setParamValue(path, val) {
        // Needed for sample accurate control
        this.parameters.get(path).setValueAtTime(val, 0);
    }

    // For WAP
    setParam(path, val) {
        // Needed for sample accurate control
        this.parameters.get(path).setValueAtTime(val, 0);
    }

    /**
     *  Get the control value at a given path.
     *
     * @return the current control value
     */
    getParamValue(path) {
        return this.parameters.get(path).value;
    }

    // For WAP
    getParam(path) {
        return this.parameters.get(path).value;
    }

    /**
     * Setup a control output handler with a function of type (path, value)
     * to be used on each generated output value. This handler will be called
     * each audio cycle at the end of the 'compute' method.
     *
     * @param handler - a function of type function(path, value)
     */
    setOutputParamHandler(handler) {
        this.output_handler = handler;
    }

    /**
     * Get the current output handler.
     */
    getOutputParamHandler() {
        return this.output_handler;
    }

    getNumInputs() {
        return parseInt(this.json_object.inputs);
    }

    getNumOutputs() {
        return parseInt(this.json_object.outputs);
    }

    // For WAP
    inputChannelCount() {
        return parseInt(this.json_object.inputs);
    }

    outputChannelCount() {
        return parseInt(this.json_object.outputs);
    }

    /**
     * Returns an array of all input paths (to be used with setParamValue/getParamValue)
     */
    getParams() {
        return this.inputs_items;
    }

    // For WAP
    getDescriptor() {
        var desc = {};
        for (const item in this.descriptor) {
            if (this.descriptor.hasOwnProperty(item)) {
                if (this.descriptor[item].label != "bypass") {
                    desc = Object.assign({ [this.descriptor[item].label]: { minValue: this.descriptor[item].min, maxValue: this.descriptor[item].max, defaultValue: this.descriptor[item].init } }, desc);
                }
            }
        }
        return desc;
    }

    /**
     * Control change
     *
     * @param channel - the MIDI channel (0..15, not used for now)
     * @param ctrl - the MIDI controller number (0..127)
     * @param value - the MIDI controller value (0..127)
     */
    ctrlChange(channel, ctrl, value) {
        if (this.fCtrlLabel[ctrl] !== []) {
            for (var i = 0; i < this.fCtrlLabel[ctrl].length; i++) {
                var path = this.fCtrlLabel[ctrl][i].path;
                this.setParamValue(path, testBernardNode.remap(value, 0, 127, this.fCtrlLabel[ctrl][i].min, this.fCtrlLabel[ctrl][i].max));
                if (this.output_handler) {
                    this.output_handler(path, this.getParamValue(path));
                }
            }
        }
    }

    /**
     * PitchWeel
     *
     * @param channel - the MIDI channel (0..15, not used for now)
     * @param value - the MIDI controller value (0..16383)
     */
    pitchWheel(channel, wheel) {
        for (var i = 0; i < this.fPitchwheelLabel.length; i++) {
            var pw = this.fPitchwheelLabel[i];
            this.setParamValue(pw.path, testBernardNode.remap(wheel, 0, 16383, pw.min, pw.max));
            if (this.output_handler) {
                this.output_handler(pw.path, this.getParamValue(pw.path));
            }
        }
    }

    /**
     * Generic MIDI message handler.
     */
    midiMessage(data) {
        var cmd = data[0] >> 4;
        var channel = data[0] & 0xf;
        var data1 = data[1];
        var data2 = data[2];

        if (channel === 9) {
            return;
        } else if (cmd === 11) {
            this.ctrlChange(channel, data1, data2);
        } else if (cmd === 14) {
            this.pitchWheel(channel, (data2 * 128.0 + data1));
        }
    }

    // For WAP
    onMidi(data) {
        midiMessage(data);
    }

    /**
     * @returns {Object} describes the path for each available param and its current value
     */
    async getState() {
        var params = new Object();
        for (let i = 0; i < this.getParams().length; i++) {
            Object.assign(params, { [this.getParams()[i]]: `${this.getParam(this.getParams()[i])}` });
        }
        return new Promise(resolve => { resolve(params) });
    }

    /**
     * Sets each params with the value indicated in the state object
     * @param {Object} state 
     */
    async setState(state) {
        return new Promise(resolve => {
            for (const param in state) {
                if (state.hasOwnProperty(param)) this.setParam(param, state[param]);
            }
            try {
                this.gui.setAttribute('state', JSON.stringify(state));
            } catch (error) {
                console.warn("Plugin without gui or GUI not defined", error);
            }
            resolve(state);
        })
    }

    /**
     * A different call closer to the preset management
     * @param {Object} patch to assign as a preset to the node
     */
    setPatch(patch) {
        this.setState(this.presets[patch])
    }

    static remap(v, mn0, mx0, mn1, mx1) {
        return (1.0 * (v - mn0) / (mx0 - mn0)) * (mx1 - mn1) + mn1;
    }

}

// Factory class
class testBernard {

    static fWorkletProcessors;

    /**
     * Factory constructor.
     *
     * @param context - the audio context
     * @param baseURL - the baseURL of the plugin folder
     */
    constructor(context, baseURL = "") {
        console.log("baseLatency " + context.baseLatency);
        console.log("outputLatency " + context.outputLatency);
        console.log("sampleRate " + context.sampleRate);

        this.context = context;
        this.baseURL = baseURL;
        this.pathTable = [];

        this.fWorkletProcessors = this.fWorkletProcessors || [];
    }

    heap2Str(buf) {
        let str = "";
        let i = 0;
        while (buf[i] !== 0) {
            str += String.fromCharCode(buf[i++]);
        }
        return str;
    }

    /**
     * Load additionnal resources to prepare the custom AudioWorkletNode. Returns a promise to be used with the created node.
     */
    async load() {
        try {
            const importObject = {
                env: {
                    memoryBase: 0,
                    tableBase: 0,
                    _abs: Math.abs,

                    // Float version
                    _acosf: Math.acos,
                    _asinf: Math.asin,
                    _atanf: Math.atan,
                    _atan2f: Math.atan2,
                    _ceilf: Math.ceil,
                    _cosf: Math.cos,
                    _expf: Math.exp,
                    _floorf: Math.floor,
                    _fmodf: (x, y) => x % y,
                    _logf: Math.log,
                    _log10f: Math.log10,
                    _max_f: Math.max,
                    _min_f: Math.min,
                    _remainderf: (x, y) => x - Math.round(x / y) * y,
                    _powf: Math.pow,
                    _roundf: Math.fround,
                    _sinf: Math.sin,
                    _sqrtf: Math.sqrt,
                    _tanf: Math.tan,
                    _acoshf: Math.acosh,
                    _asinhf: Math.asinh,
                    _atanhf: Math.atanh,
                    _coshf: Math.cosh,
                    _sinhf: Math.sinh,
                    _tanhf: Math.tanh,
                    _isnanf: Number.isNaN,
                    _isinff: function (x) { return !isFinite(x); },
                    _copysignf: function (x, y) { return Math.sign(x) === Math.sign(y) ? x : -x; },

                    // Double version
                    _acos: Math.acos,
                    _asin: Math.asin,
                    _atan: Math.atan,
                    _atan2: Math.atan2,
                    _ceil: Math.ceil,
                    _cos: Math.cos,
                    _exp: Math.exp,
                    _floor: Math.floor,
                    _fmod: (x, y) => x % y,
                    _log: Math.log,
                    _log10: Math.log10,
                    _max_: Math.max,
                    _min_: Math.min,
                    _remainder: (x, y) => x - Math.round(x / y) * y,
                    _pow: Math.pow,
                    _round: Math.fround,
                    _sin: Math.sin,
                    _sqrt: Math.sqrt,
                    _tan: Math.tan,
                    _acosh: Math.acosh,
                    _asinh: Math.asinh,
                    _atanh: Math.atanh,
                    _cosh: Math.cosh,
                    _sinh: Math.sinh,
                    _tanh: Math.tanh,
                    _isnan: Number.isNaN,
                    _isinf: function (x) { return !isFinite(x); },
                    _copysign: function (x, y) { return Math.sign(x) === Math.sign(y) ? x : -x; },

                    table: new WebAssembly.Table({ initial: 0, element: "anyfunc" })
                }
            };

            let real_url = (this.baseURL === "") ? "testBernard.wasm" : (this.baseURL + "/testBernard.wasm");
            const dspFile = await fetch(real_url);
            const dspBuffer = await dspFile.arrayBuffer();
            const dspModule = await WebAssembly.compile(dspBuffer);
            const dspInstance = await WebAssembly.instantiate(dspModule, importObject);

            let HEAPU8 = new Uint8Array(dspInstance.exports.memory.buffer);
            let json = this.heap2Str(HEAPU8);
            let json_object = JSON.parse(json);
            let options = { wasm_module: dspModule, json: json };

            if (this.fWorkletProcessors.indexOf(name) === -1) {
                try {
                    let re = /JSON_STR/g;
                    let testBernardProcessorString1 = testBernardProcessorString.replace(re, json);
                    let real_url = window.URL.createObjectURL(new Blob([testBernardProcessorString1], { type: 'text/javascript' }));
                    await this.context.audioWorklet.addModule(real_url);
                    // Keep the DSP name
                    console.log("Keep the DSP name");
                    this.fWorkletProcessors.push(name);
                } catch (e) {
                    console.error(e);
                    console.error("Faust " + this.name + " cannot be loaded or compiled");
                    return null;
                }
            }
            this.node = new testBernardNode(this.context, this.baseURL,
                {
                    numberOfInputs: (parseInt(json_object.inputs) > 0) ? 1 : 0,
                    numberOfOutputs: (parseInt(json_object.outputs) > 0) ? 1 : 0,
                    channelCount: Math.max(1, parseInt(json_object.inputs)),
                    outputChannelCount: [parseInt(json_object.outputs)],
                    channelCountMode: "explicit",
                    channelInterpretation: "speakers",
                    processorOptions: options
                });
            this.node.onprocessorerror = () => { console.log('An error from testBernard-processor was detected.'); }
            return (this.node);
        } catch (e) {
            console.error(e);
            console.error("Faust " + this.name + " cannot be loaded or compiled");
            return null;
        }
    }

    async loadGui() {
        return new Promise((resolve, reject) => {
            try {
                // DO THIS ONLY ONCE. If another instance has already been added, do not add the html file again
                let real_url = (this.baseURL === "") ? "main.html" : (this.baseURL + "/main.html");
                if (!this.linkExists(real_url)) {
                    // LINK DOES NOT EXIST, let's add it to the document
                    var link = document.createElement('link');
                    link.rel = 'import';
                    link.href = real_url;
                    document.head.appendChild(link);
                    link.onload = (e) => {
                        // the file has been loaded, instanciate GUI
                        // and get back the HTML elem
                        // HERE WE COULD REMOVE THE HARD CODED NAME
                        var element = createtestBernardGUI(this.node);
                        resolve(element);
                    }
                } else {
                    // LINK EXIST, WE AT LEAST CREATED ONE INSTANCE PREVIOUSLY
                    // so we can create another instance
                    var element = createtestBernardGUI(this.node);
                    resolve(element);
                }
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    };

    linkExists(url) {
        return document.querySelectorAll(`link[href="${url}"]`).length > 0;
    }
}

// Template string for AudioWorkletProcessor

let testBernardProcessorString = `

    'use strict';

    // Monophonic Faust DSP
    class testBernardProcessor extends AudioWorkletProcessor {
        
        // JSON parsing functions
        static parse_ui(ui, obj, callback)
        {
            for (var i = 0; i < ui.length; i++) {
                testBernardProcessor.parse_group(ui[i], obj, callback);
            }
        }
        
        static parse_group(group, obj, callback)
        {
            if (group.items) {
                testBernardProcessor.parse_items(group.items, obj, callback);
            }
        }
        
        static parse_items(items, obj, callback)
        {
            for (var i = 0; i < items.length; i++) {
                callback(items[i], obj, callback);
            }
        }
        
        static parse_item1(item, obj, callback)
        {
            if (item.type === "vgroup"
                || item.type === "hgroup"
                || item.type === "tgroup") {
                testBernardProcessor.parse_items(item.items, obj, callback);
            } else if (item.type === "hbargraph"
                       || item.type === "vbargraph") {
                // Nothing
            } else if (item.type === "vslider"
                       || item.type === "hslider"
                       || item.type === "button"
                       || item.type === "checkbox"
                       || item.type === "nentry") {
                obj.push({ name: item.address,
                         defaultValue: item.init,
                         minValue: item.min,
                         maxValue: item.max });
            }
        }
        
        static parse_item2(item, obj, callback)
        {
            if (item.type === "vgroup"
                || item.type === "hgroup"
                || item.type === "tgroup") {
                testBernardProcessor.parse_items(item.items, obj, callback);
            } else if (item.type === "hbargraph"
                       || item.type === "vbargraph") {
                // Keep bargraph adresses
                obj.outputs_items.push(item.address);
                obj.pathTable[item.address] = parseInt(item.index);
            } else if (item.type === "vslider"
                       || item.type === "hslider"
                       || item.type === "button"
                       || item.type === "checkbox"
                       || item.type === "nentry") {
                // Keep inputs adresses
                obj.inputs_items.push(item.address);
                obj.pathTable[item.address] = parseInt(item.index);
            }
        }
     
        static get parameterDescriptors() 
        {
            // Analyse JSON to generate AudioParam parameters
            var params = [];
            testBernardProcessor.parse_ui(JSON.parse(\`JSON_STR\`).ui, params, testBernardProcessor.parse_item1);
            return params;
        }
       
        constructor(options)
        {
            super(options);
            this.running = true;
            
            const importObject = {
                    env: {
                        memoryBase: 0,
                        tableBase: 0,

                        // Integer version
                        _abs: Math.abs,

                        // Float version
                        _acosf: Math.acos,
                        _asinf: Math.asin,
                        _atanf: Math.atan,
                        _atan2f: Math.atan2,
                        _ceilf: Math.ceil,
                        _cosf: Math.cos,
                        _expf: Math.exp,
                        _floorf: Math.floor,
                        _fmodf: function(x, y) { return x % y; },
                        _logf: Math.log,
                        _log10f: Math.log10,
                        _max_f: Math.max,
                        _min_f: Math.min,
                        _remainderf: function(x, y) { return x - Math.round(x/y) * y; },
                        _powf: Math.pow,
                        _roundf: Math.fround,
                        _sinf: Math.sin,
                        _sqrtf: Math.sqrt,
                        _tanf: Math.tan,
                        _acoshf: Math.acosh,
                        _asinhf: Math.asinh,
                        _atanhf: Math.atanh,
                        _coshf: Math.cosh,
                        _sinhf: Math.sinh,
                        _tanhf: Math.tanh,

                        // Double version
                        _acos: Math.acos,
                        _asin: Math.asin,
                        _atan: Math.atan,
                        _atan2: Math.atan2,
                        _ceil: Math.ceil,
                        _cos: Math.cos,
                        _exp: Math.exp,
                        _floor: Math.floor,
                        _fmod: function(x, y) { return x % y; },
                        _log: Math.log,
                        _log10: Math.log10,
                        _max_: Math.max,
                        _min_: Math.min,
                        _remainder:function(x, y) { return x - Math.round(x/y) * y; },
                        _pow: Math.pow,
                        _round: Math.fround,
                        _sin: Math.sin,
                        _sqrt: Math.sqrt,
                        _tan: Math.tan,
                        _acosh: Math.acosh,
                        _asinh: Math.asinh,
                        _atanh: Math.atanh,
                        _cosh: Math.cosh,
                        _sinh: Math.sinh,
                        _tanh: Math.tanh,

                        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
                    }
            };
            
            this.testBernard_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
            this.json_object = JSON.parse(options.processorOptions.json);
         
            this.output_handler = function(path, value) { this.port.postMessage({ path: path, value: value }); };
            
            this.ins = null;
            this.outs = null;

            this.dspInChannnels = [];
            this.dspOutChannnels = [];

            this.numIn = parseInt(this.json_object.inputs);
            this.numOut = parseInt(this.json_object.outputs);

            // Memory allocator
            this.ptr_size = 4;
            this.sample_size = 4;
            this.integer_size = 4;
            
            this.factory = this.testBernard_instance.exports;
            this.HEAP = this.testBernard_instance.exports.memory.buffer;
            this.HEAP32 = new Int32Array(this.HEAP);
            this.HEAPF32 = new Float32Array(this.HEAP);

            // Warning: keeps a ref on HEAP in Chrome and prevent proper GC
            //console.log(this.HEAP);
            //console.log(this.HEAP32);
            //console.log(this.HEAPF32);

            // bargraph
            this.outputs_timer = 5;
            this.outputs_items = [];

            // input items
            this.inputs_items = [];
        
            // Start of HEAP index

            // DSP is placed first with index 0. Audio buffer start at the end of DSP.
            this.audio_heap_ptr = parseInt(this.json_object.size);

            // Setup pointers offset
            this.audio_heap_ptr_inputs = this.audio_heap_ptr;
            this.audio_heap_ptr_outputs = this.audio_heap_ptr_inputs + (this.numIn * this.ptr_size);

            // Setup buffer offset
            this.audio_heap_inputs = this.audio_heap_ptr_outputs + (this.numOut * this.ptr_size);
            this.audio_heap_outputs = this.audio_heap_inputs + (this.numIn * NUM_FRAMES * this.sample_size);
            
            // Start of DSP memory : DSP is placed first with index 0
            this.dsp = 0;

            this.pathTable = [];
         
            // Send output values to the AudioNode
            this.update_outputs = function ()
            {
                if (this.outputs_items.length > 0 && this.output_handler && this.outputs_timer-- === 0) {
                    this.outputs_timer = 5;
                    for (var i = 0; i < this.outputs_items.length; i++) {
                        this.output_handler(this.outputs_items[i], this.HEAPF32[this.pathTable[this.outputs_items[i]] >> 2]);
                    }
                }
            }
            
            this.initAux = function ()
            {
                var i;
                
                if (this.numIn > 0) {
                    this.ins = this.audio_heap_ptr_inputs;
                    for (i = 0; i < this.numIn; i++) {
                        this.HEAP32[(this.ins >> 2) + i] = this.audio_heap_inputs + ((NUM_FRAMES * this.sample_size) * i);
                    }
                    
                    // Prepare Ins buffer tables
                    var dspInChans = this.HEAP32.subarray(this.ins >> 2, (this.ins + this.numIn * this.ptr_size) >> 2);
                    for (i = 0; i < this.numIn; i++) {
                        this.dspInChannnels[i] = this.HEAPF32.subarray(dspInChans[i] >> 2, (dspInChans[i] + NUM_FRAMES * this.sample_size) >> 2);
                    }
                }
                
                if (this.numOut > 0) {
                    this.outs = this.audio_heap_ptr_outputs;
                    for (i = 0; i < this.numOut; i++) {
                        this.HEAP32[(this.outs >> 2) + i] = this.audio_heap_outputs + ((NUM_FRAMES * this.sample_size) * i);
                    }
                    
                    // Prepare Out buffer tables
                    var dspOutChans = this.HEAP32.subarray(this.outs >> 2, (this.outs + this.numOut * this.ptr_size) >> 2);
                    for (i = 0; i < this.numOut; i++) {
                        this.dspOutChannnels[i] = this.HEAPF32.subarray(dspOutChans[i] >> 2, (dspOutChans[i] + NUM_FRAMES * this.sample_size) >> 2);
                    }
                }
                
                // Parse UI
                testBernardProcessor.parse_ui(this.json_object.ui, this, testBernardProcessor.parse_item2);
                
                // Init DSP
                this.factory.init(this.dsp, sampleRate); // 'sampleRate' is defined in AudioWorkletGlobalScope  
            }

            this.setParamValue = function (path, val)
            {
                this.HEAPF32[this.pathTable[path] >> 2] = val;
            }

            this.getParamValue = function (path)
            {
                return this.HEAPF32[this.pathTable[path] >> 2];
            }

            // Init resulting DSP
            this.initAux();
        }
        
        process(inputs, outputs, parameters) 
        {
            var input = inputs[0];
            var output = outputs[0];
            
            // Check inputs
            if (this.numIn > 0 && (!input || !input[0] || input[0].length === 0)) {
                //console.log("Process input error");
                return true;
            }
            // Check outputs
            if (this.numOut > 0 && (!output || !output[0] || output[0].length === 0)) {
                //console.log("Process output error");
                return true;
            }
            
            // Copy inputs
            if (input !== undefined) {
                for (var chan = 0; chan < Math.min(this.numIn, input.length); ++chan) {
                    var dspInput = this.dspInChannnels[chan];
                    dspInput.set(input[chan]);
                }
            }
            
            /*
            TODO: sample accurate control change is not yet handled
            When no automation occurs, params[i][1] has a length of 1,
            otherwise params[i][1] has a length of NUM_FRAMES with possible control change each sample
            */
            
            // Update controls
            for (const path in parameters) {
                const paramArray = parameters[path];
                this.setParamValue(path, paramArray[0]);
            }
        
          	// Compute
            try {
                this.factory.compute(this.dsp, NUM_FRAMES, this.ins, this.outs);
            } catch(e) {
                console.log("ERROR in compute (" + e + ")");
            }
            
            // Update bargraph
            this.update_outputs();
            
            // Copy outputs
            if (output !== undefined) {
                for (var chan = 0; chan < Math.min(this.numOut, output.length); ++chan) {
                    var dspOutput = this.dspOutChannnels[chan];
                    output[chan].set(dspOutput);
                }
            }
            
            return this.running;
    	}
        
        handleMessage(event)
        {
            var msg = event.data;
            switch (msg.type) {
                case "destroy": this.running = false; break;
            }
        }
    }

    // Globals
    const NUM_FRAMES = 128;
    try {
        registerProcessor('testBernard', testBernardProcessor);
    } catch (error) {
        console.warn(error);
    }
`;

const dspName = "testBernard";

// WAP factory or npm package module
if (typeof module === "undefined") {
    window.testBernard = testBernard;
    window.FausttestBernard = testBernard;
    window[dspName] = testBernard;
} else {
    module.exports = { testBernard };
}
