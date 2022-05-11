

export function addEventOnPlugin(currentPluginAudioNode) {
    /** @type {HTMLSelectElement} */ const pluginParamSelector = document.querySelector('#pluginParamSelector');
    /** @type {HTMLInputElement} */ const pluginAutomationLengthInput = document.querySelector('#pluginAutomationLength');
    /** @type {HTMLInputElement} */ const pluginAutomationApplyButton = document.querySelector('#pluginAutomationApply');
    // /** @type {HTMLDivElement} */ const bpfContainer = document.querySelector('#pluginAutomationEditor');
    //
    // pluginParamSelector.addEventListener('input', async (e) => {
    //     if (!currentPluginAudioNode) return;
    //     const paramId = e.target.value;
    //     if (paramId === '-1') return;
    //     if (Array.from(bpfContainer.querySelectorAll('.pluginAutomationParamId')).find(/** @param {HTMLSpanElement} span */(span) => span.textContent === paramId)) return;
    //     const div = document.createElement('div');
    //     div.classList.add('pluginAutomation');
    //     const span = document.createElement('span');
    //     span.classList.add('pluginAutomationParamId');
    //     span.textContent = paramId;
    //     div.appendChild(span);
    //     const bpf = document.createElement('webaudiomodules-host-bpf');
    //     const info = await currentPluginAudioNode.getParameterInfo(paramId);
    //     const { minValue, maxValue, defaultValue } = info[paramId];
    //     bpf.setAttribute('min', minValue);
    //     bpf.setAttribute('max', maxValue);
    //     bpf.setAttribute('default', defaultValue);
    //     div.appendChild(bpf);
    //     bpfContainer.appendChild(div);
    //     pluginParamSelector.selectedIndex = 0;
    // });
    pluginAutomationLengthInput.addEventListener('input', (e) => {
        const domain = +e.target.value;
        if (!domain) return;
        bpfContainer.querySelectorAll('webaudiomodules-host-bpf').forEach(/** @param {import("./src/js/bpf").default} bpf */(bpf) => {
            bpf.setAttribute('domain', domain);
        });
    });
    // pluginAutomationApplyButton.addEventListener('click', () => {
    //     if (!currentPluginAudioNode) return;
    //     bpfContainer.querySelectorAll('.pluginAutomation').forEach(/** @param {HTMLDivElement} div */(div) => {
    //         const paramId = div.querySelector('.pluginAutomationParamId').textContent;
    //         /** @type {import("./src/js/bpf").default} */
    //         const bpf = div.querySelector('webaudiomodules-host-bpf');
    //         console.log(bpf);
    //         bpf.apply(currentPluginAudioNode, paramId);
    //     });
    // });
}


export const mountPlugin = (mount, domModel) => {
    mount.innerHTML = '';
    mount.appendChild(domModel);
};

// export const populateParamSelector = async (wamNode) => {
//     /** @type {HTMLDivElement} */ const bpfContainer = document.querySelector('#pluginAutomationEditor');
//     bpfContainer.innerHTML = '';
//     pluginParamSelector.innerHTML = '<option value="-1" disabled selected>Add Automation...</option>';
//     const info = await wamNode.getParameterInfo();
//     // eslint-disable-next-line
//     for (const paramId in info) {
//         const {minValue, maxValue, label} = info[paramId];
//         const option = new Option(`${paramId} (${label}): ${minValue} - ${maxValue}`, paramId);
//         pluginParamSelector.add(option);
//     }
//     pluginParamSelector.selectedIndex = 0;
// };




/**
 * @param {import('../api/src').WamNode} wamNode
 */
export const populateParamSelector = async (wamNode, bpfContainer, pluginParamSelector,track) => {
    // bpfContainer.innerHTML = '';
    pluginParamSelector.innerHTML = '<i class="project diagram icon"></i>';
    const info = await wamNode.getParameterInfo();
    // console.log(info)
    // eslint-disable-next-line
    let values = []
    let params = []
    for (const paramId in info) {
        const {minValue, maxValue, label} = info[paramId];
        params.push(paramId)
        // const option = new Option(`${paramId} (${label}): ${minValue} - ${maxValue}`, paramId);
        // const div = document.createElement('div');
        // div.classList.add("ui", "dropdown", "item","icon", "inverted")
        let name = `${paramId} (${label}): ${minValue} - ${maxValue}`;
        values.push({
            name: name,
            value: values.length,
            class: `item dropItem${values.length}`
        });


    }


    // }

    $('.ui.dropdown.auto').dropdown({
        action: 'hide',
        values: values
    });
    for(let i = 0 ; i < values.length; i++){
        let item = pluginParamSelector.querySelector(`.dropItem${i}`);
        let param = params[i]
        const {minValue, maxValue, label} = info[param];
        item.onclick = () =>{
            const bpf = document.createElement('webaudiomodules-host-bpf');
            bpf.className = param;
            bpf.setAttribute('min', minValue);
            bpf.setAttribute('max', maxValue);
            let defaultValue = (maxValue - minValue) / 2;
            bpf.setAttribute('default', defaultValue);
            bpf.setAttribute('domain', track.duration);
            bpfContainer.appendChild(bpf);
        }
    }

};