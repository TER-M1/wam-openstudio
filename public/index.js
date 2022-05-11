import {MainAudio, AudioTrack, SimpleAudioWorkletNode, audioCtx, mainAudio} from "./src/js/audio_loader.js";
import {activateMainVolume, exploreTracks} from "./src/js/page_init.js";
import {onLoopBegginingInputChange, onLoopEndingInputChange, updateCursorTracks} from "./src/js/playhead.js";



const btnStart = document.getElementById("btn-start");
const zoomIn = document.getElementById("btn-zoom-in");
const zoomOut = document.getElementById("btn-zoom-out");
const btnRestart = document.getElementById("restart");
const inputLoop = document.getElementById("loop");
const volumeinput = document.getElementById("volume");
const inputMute = document.getElementById("mute");
const loopBeginning = document.getElementById("loop-beginning-input");
const loopEnding = document.getElementById("loop-end-input");
const startVolume = 20 / 100;
var currentPluginAudioNode;
var intervalCursorTracks = undefined;




(async () => {
    btnStart.hidden = false;
    // var trackElements = $(".track.sound");
    // let t = document.getElementsByClassName("track sound");


    /*
    PROCESSOR INITIALIZATION
     */
    await audioCtx.audioWorklet.addModule("./src/js/processor.js");


    /*
    INITIALIZATION PAGES ELEMENTS
     */
    activateMainVolume(mainAudio, startVolume);
    exploreTracks();


    /*
    PLUGIN CONNECTION
     */
    // const {default: initializeWamHost} = await import("./plugins/testBern/utils/sdk/src/initializeWamHost.js");
    // const [hostGroupId] = await initializeWamHost(audioCtx);
    // const initializeWamHost = await import("../../plugins/testBern/utils/sdk/src/initializeWamHost.js");
    // mainAudio.hostGroupId = await initializeWamHost(audioCtx);

    // loadPlugs();
    // const {default: initializeWamHost} = await import("./plugins/testBern/utils/sdk/src/initializeWamHost.js");
    // const [hostGroupId] = await initializeWamHost(audioCtx);
    //
    // var {default: WAM} = await import ("https://michael-marynowicz.github.io/TER/pedalboard/index.js");
    // var instance = await WAM.createInstance(hostGroupId, audioCtx);
    // connectPlugin(audioCtx, mainAudio.tracks[0].audioWorkletNode, instance._audioNode);
    // currentPluginAudioNode = instance._audioNode;
    // connectPlugin(audioCtx, mainAudio.tracks[0].audioWorkletNode, mainAudio.masterVolumeNode);
    // var pluginDomModel = await instance.createGui();
    // mountPlugin(document.querySelector("#mount2"), pluginDomModel);

    /*
    PLUGIN PARAMETERS CONNECTION
     */
    // await populateParamSelector(instance._audioNode);
    //
    // pluginParamSelector.onclick = () => {
    //     populateParamSelector(instance._audioNode);
    // };
    //
    // addEventOnPlugin(currentPluginAudioNode);


    /*
    EVENT LISTENERS
     */
    btnStart.playing = false;
    btnStart.onclick = () => {
        console.log(btnStart.playing);

        if (audioCtx.state === "suspended") {
            audioCtx.resume();
            if (intervalCursorTracks === undefined) {
                intervalCursorTracks = setInterval(() => {
                    updateCursorTracks();
                }, 33);
            }
        }

        if (btnStart.playing === false) {
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 1;
                if (intervalCursorTracks === undefined) {
                    intervalCursorTracks = setInterval(() => {
                        updateCursorTracks();
                    }, 33);
                }
                // if(track.bpf.className != null){
                //     track.bpf.querySelector("webaudiomodules-host-bpf").apply(track.pluginInstance._audioNode,track.bpf.className)}

            });
            btnStart.playing = true
        }
        else {
            mainAudio.tracks.forEach((track) => {
                track.audioWorkletNode.parameters.get("playing").value = 0;
                // if(track.bpf.className != null){
                // track.bpf.querySelector("webaudiomodules-host-bpf").apply(track.pluginInstance._audioNode,track.bpf.className)}
                if (intervalCursorTracks !== undefined) {
                    updateCursorTracks();
                    clearInterval(intervalCursorTracks);
                    intervalCursorTracks = undefined;
                }
            });
            btnStart.playing = false;
        }
    }
    inputLoop.onclick = () => {
        console.log("loop pressed")
        mainAudio.tracks.forEach((track) => {
            const loop = track.audioWorkletNode.parameters.get("loop").value;
            if (loop === 1) {
                track.audioWorkletNode.parameters.get("loop").value = 0;
                inputLoop.checked = false;
            } else {
                track.audioWorkletNode.parameters.get("loop").value = 1;
                inputLoop.checked = true;
            }
        })
    };

    inputMute.onclick = () => {
        if (!mainAudio.isMuted) {
            console.log("mute");
            // mainAudio.tracks.forEach((track) => {
            // track.gainOutNode.value = 0;
            // });
            mainAudio.mute();
        } else {
            console.log("unmute");
            mainAudio.unMute();
        }
    };

    loopBeginning.addEventListener("change", onLoopBegginingInputChange);
    loopEnding.addEventListener("change", onLoopEndingInputChange);

})();
