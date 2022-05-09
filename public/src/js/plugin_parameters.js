
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
export const populateParamSelector = async (wamNode,bpfContainer,pluginParamSelector) => {
    bpfContainer.innerHTML = '';
    pluginParamSelector.innerHTML = '';
    const info = await wamNode.getParameterInfo();
    console.log(info)
    // eslint-disable-next-line
    for (const paramId in info) {
        const { minValue, maxValue,label } = info[paramId];
        const option = new Option(`${paramId} (${label}): ${minValue} - ${maxValue}`, paramId);
        const div = document.createElement('div');
        div.innerHTML = `${paramId} (${label}): ${minValue} - ${maxValue}`;
        div.addEventListener('click', async (e) => {
            console.log("hello")
            console.log(label)
            if (!currentPluginAudioNode) return;
            const paramId = e.target.value;
            if (paramId === '-1') return;
            if (Array.from(bpfContainer.querySelectorAll('.pluginAutomationParamId')).find(/** @param {HTMLSpanElement} span */(span) => span.textContent === paramId)) return;
            const div2 = document.createElement('div');
            div2.classList.add('pluginAutomation');
            const span = document.createElement('span');
            span.classList.add('pluginAutomationParamId');
            span.textContent = paramId;
            div2.appendChild(span);
            const bpf = document.createElement('webaudiomodules-host-bpf');
            console.log(bpf)
            bpf.setAttribute('min', minValue);
            bpf.setAttribute('max', maxValue);
            let defaultValue = (maxValue - minValue) / 2;
            bpf.setAttribute('default', defaultValue);
            div2.appendChild(bpf);
            bpfContainer.appendChild(div2);
            pluginParamSelector.selectedIndex = 0;
            console.log("done");
        });
        // pluginParamSelector.add(option);
        pluginParamSelector.appendChild(div)
    }
    pluginParamSelector.selectedIndex = 0;
};