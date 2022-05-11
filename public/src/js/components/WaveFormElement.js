const templateCanvas = document.createElement("template");
templateCanvas.innerHTML = /*html*/`
<div id = "pluginAutomationEditor"></div>
<canvas height="104" width="2000" class="can"></canvas>
`;


export default class WaveFormElement extends HTMLElement {
    id = undefined;
    canvas = undefined;
    bpf = undefined;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = templateCanvas.innerHTML;
        this.defClass();
        this.defId();
    }

    disconnectedCallback() {

    }

    defClass() {
        this.className = `wave-form ${this.id}`
    }

    defId() {
        this.canvas = this.shadowRoot.querySelector(".can");
        this.canvas.id = this.id;
        this.bpf = this.shadowRoot.querySelector("#pluginAutomationEditor")
    }
}


