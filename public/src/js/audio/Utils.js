import MainAudio from "../audio/MainAudio.js";

export const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
export const mainAudio = new MainAudio(audioCtx);
if (audioCtx.state === "suspended") {
    audioCtx.resume();
}