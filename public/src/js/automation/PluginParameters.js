
/**
 * @param {import('../api/src').WamNode} wamNode
 */
export const populateParamSelector = async (wamNode, bpfContainer, pluginParamSelector, track) => {

    pluginParamSelector.innerHTML = '<i class="project diagram icon"></i>';
    const info = await wamNode.getParameterInfo();

    let values = []
    let params = []
    for (const paramId in info) {
        const {minValue, maxValue, label} = info[paramId];
        params.push(paramId)

        let name = `${paramId} (${label}): ${minValue} - ${maxValue}`;
        values.push({
            name: name,
            value: values.length,
            class: `item dropItem${values.length}`
        });

        console.log("wam node : ");
        track.audioWorkletNode.disconnectEvents(wamNode.instanceId);
        track.audioWorkletNode.connectEvents(wamNode.instanceId);
    }

    $('.ui.dropdown.auto').dropdown({
        action: 'hide',
        values: values
    });

    for (let i = 0; i < values.length; i++) {
        let item = pluginParamSelector.querySelector(`.dropItem${i}`);
        let param = params[i]
        const {minValue, maxValue, label} = info[param];
        item.onclick = () => {
            console.log("item: ", item);
            if (track.hasBPF(param)) {
                console.log("in?")
                let bpf = track.getBPF(param);
                bpf.style.display = "block";
            }
            else {
                const bpf = document.createElement('webaudiomodules-host-bpf');
                bpf.className = param;
                bpf.paramID = param;
                bpf.setAttribute('min', minValue);
                bpf.setAttribute('max', maxValue);
                let defaultValue = (maxValue - minValue) / 2;
                bpf.setAttribute('default', defaultValue);
                bpf.setAttribute('domain', track.duration);
                bpfContainer.appendChild(bpf);
                track.addBPF(bpf);
                track.bpf = bpf;
            }
        }
    }

};