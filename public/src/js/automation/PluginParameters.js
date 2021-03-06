/**
 * @param {import('../api/src').WamNode} wamNode
 */
import {mainAudio} from "../audio/Utils.js";
import BPF from "./BPF.js";

customElements.define(
    'webaudiomodules-host-bpf',
    BPF
)

export const populateParamSelector = async (wamNode, bpfContainer, pluginParamSelector, track) => {

    pluginParamSelector.innerHTML = '<i class="project diagram icon"></i>';
    const info = await wamNode.getParameterInfo();

    let values = []
    let params = []

    values.push({
        name: "Hide current automation",
        value: 0,
        class: `item dropItemHide`
    })

    for (const paramId in info) {
        const {minValue, maxValue, label} = info[paramId];
        params.push(paramId)

        let name = `${paramId} (${label}): ${minValue} - ${maxValue}`;
        values.push({
            name: name,
            value: values.length,
            class: `item dropItem${values.length}`
        });

        track.audioWorkletNode.disconnectEvents(wamNode.instanceId);
        track.audioWorkletNode.connectEvents(wamNode.instanceId);
    }

    $('.ui.dropdown.auto').dropdown({
        action: 'hide',
        values: values
    });

    for (let i = 1; i < values.length; i++) {
        let item = pluginParamSelector.querySelector(`.dropItem${i}`);
        let param = params[i-1]
        const {minValue, maxValue, label} = info[param];
        item.onclick = () => {
            if (track.currentBpf !== undefined) {
                track.currentBpf.style.display = "none";
            }
            if (track.hasBPF(param)) {
                let bpf = track.getBPF(param);
                bpf.style.display = "block";
                track.currentBpf = bpf;
            }
            else {
                const bpf = document.createElement('webaudiomodules-host-bpf');
                bpf.className = param;
                bpf.paramID = param;
                bpf.style.position = "relative";
                bpf.setAttribute('min', minValue);
                bpf.setAttribute('max', maxValue);
                let defaultValue = (maxValue - minValue) / 2;
                bpf.setAttribute('default', defaultValue);
                bpf.setAttribute('domain', track.duration);
                bpf.setSizeBPF(mainAudio.pixelAmountFromBufferLength(track));
                bpfContainer.appendChild(bpf);
                track.addBPF(bpf);
                track.currentBpf = bpf;
            }
        }
    }
    let itemHide = pluginParamSelector.querySelector(".dropItemHide");
    itemHide.onclick = () => {
        if (track.currentBpf !== undefined) {
            track.currentBpf.style.display = "none";
        }
    }
};