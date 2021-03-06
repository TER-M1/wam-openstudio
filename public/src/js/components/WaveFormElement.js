const templateCanvas = document.createElement("template");
templateCanvas.innerHTML = /*html*/`
<style>
.can {
    grid-column: 1;
    grid-row: 1;
}

.bpf-div {
    grid-column: 1;
    grid-row: 1;
}

</style>
<div id = "pluginAutomationEditor" class="bpf-div"></div>
<canvas height="104" width="2000" class="can"></canvas>

`;


export default class WaveFormElement extends HTMLElement {
    id = undefined;
    canvas = undefined;
    bpfContainer = undefined;

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
        this.bpfContainer = this.shadowRoot.querySelector("#pluginAutomationEditor")
    }
}


