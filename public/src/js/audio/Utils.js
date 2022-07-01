import MainAudio from "../audio/MainAudio.js";

export const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
export const mainAudio = new MainAudio(audioCtx);

export const initWam = async () => {
    const {initializeWamHost} = await import("../../../lib/sdk/index.js");
    var [hostGroupId, groupKey] = await initializeWamHost(audioCtx);
    return { hostGroupId, groupKey}
}

/**
 * Get the first point to use with automation.
 *
 * @param {number} totalDuration
 * @param {number} currentTime
 * @param {number} totalPoint
 */
export function getStartingPoint(totalDuration, currentTime, totalPoint) {
    let point = (totalPoint * currentTime) / totalDuration;
    let integPoint = Math.floor(point);
    let frac = point - integPoint;
    if (frac < 0.5) return integPoint;
    else return integPoint+1;
}
