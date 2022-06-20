import {mainAudio} from "../audio/Utils.js";

const template = document.createElement("template");

template.innerHTML = /*html*/`
<script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
<script src="../../lib/semantic.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/components/icon.min.css">
<link rel="stylesheet" href="../../lib/semantic.min.css" type="text/css">

<style>

/* Track Element */
.track-element {
    border: 1px solid black;
    height: 104px;
    width: 180px;
    background-color: #31353A;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.track-element-color {
    flex-grow: 3;
    background-color: greenyellow !important;
}

.track-element-tools {
    flex-grow: 20;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.track-name {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding-top: 0.5em;
    /*flex-grow: 1;*/
    color: lightgray;
    font-family: monospace;
    font-weight: bold;
    font-size: 1.1em;
}

.ui.black.label {
    width: 150px;
    overflow     : hidden;
    text-overflow: ellipsis;
    white-space  : nowrap;
    background-color: transparent !important; 
    user-select: none;
    text-align: center;
    color: lightgrey !important;
    font-size: 13px;
}

.item.tool.close {
    padding-top: 3px;
    margin-right: 5px;
    margin-left: 2px;
    margin-bottom: 3px;
    border-radius: 5px;
}

.item.tool.close:hover {
    background-color: #3b4046 !important;
    display: flex;
}

.item.tool.close {
    flex-grow: 2; !important;
}

.track-volume, .balance {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    padding-right: 0.5em;
    padding-left: 0.5em;
    justify-content: space-around;
    align-items: center;
}

.right-icon, .left-icon, .mute-icon, .solo-icon {
    font-size: 1.3em;
    font-weight: bold;
    font-family: monospace;
    font-style: normal;
    pointer-events: none;
    user-select: none;
}

.left-icon {
    color: lightgray;
    padding-left: 2px;
    padding-right: 1px;
    user-select: none;
}

.right-icon {
    color: lightgray;
    padding-left: 1px;
    padding-right: 4px;
    user-select: none;
}

.mute-icon, .solo-icon {
    font-size: 1.3em;
    user-select: none;
}

a.item.tool.mute:link {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
}

.track-controls {
    padding-top: 0.2em;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    /*flex-grow: 6;*/
    align-items: center;
    justify-content: space-around;
}

.item.tool {
    color: grey;
}

.item.tool:hover {
    color: white;
}

a.item.menu {
    background-color: #4d5ed1 !important;
}

a.item.menu:hover {
    background-color: #4d5ed1 !important;
}

a.item.volume-slider {
    width: 15em; height: auto;
}
i.icon {
    margin: 0 !important;
}

</style>

<div class="track-element-tools">
    <div class="track-name">
        
    </div>
    <div class="track-volume">
        <i class="volume down icon"></i>
        <div class="slider track sound"><input type="range" min="0" max="1" value=".5" step=".01" class="input track sound"></div>
        <i class="volume up icon"></i>

    </div>
    <div class="balance">
        <i class="left-icon">L</i>
        <div class="track balance"><input type="range" min="-1" max="1" value="0" step=".1" class="input track balance"></div>
        <i class="right-icon">R</i>

    </div>

    <div class="track-controls">
        <a class="item tool mute">
            <i class="mute-icon">M</i>
        </a>
        <a class="item tool solo">
            <i class="mute-icon">S</i>
        </a>
<!--        <a class="item tool">-->
<!--            <i class="project diagram icon"></i>-->
<!--        </a>-->
    </div>
</div>
<div class="track-element-color"></div>
 `;

export default class TrackElement extends HTMLElement {
    /**
     *
     * @type {AudioTrack}
     */
    track = undefined;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }


    connectedCallback() {
        this.shadowRoot.innerHTML = template.innerHTML;
        this.fixTrackNumber();
        this.defineListeners();
        this.defineRemoveTrack();
        this.soloTrackListeners();
    }

    disconnectedCallback() {

    }

    fixTrackNumber() {
        const name = this.shadowRoot.querySelector(".track-name");
        name.id = `${this.track.id}`;
        name.innerHTML = `
        <div class="ui black label">
            ${this.track.name}
        </div>
        <a class="item tool close">
            <i class="times red icon"></i>
        </a>
        `;
    }

    defineListeners() {
        const rangeInputSound = this.shadowRoot.querySelector("input.track.sound");
        rangeInputSound.oninput = (e) => {
            if (!this.track.isMuted) {
                this.track.setVolume(rangeInputSound.value);
            }
            this.track.oldGainValue = rangeInputSound.value;
        };

        const rangeInputBalance = this.shadowRoot.querySelector("input.track.balance");
        rangeInputBalance.oninput = (e) => {
            this.track.pannerNode.pan.value = rangeInputBalance.value;
        };

        const muteTrack = this.shadowRoot.querySelector(".item.tool.mute");

        muteTrack.onclick = () => {
            if (this.track.isMuted) {
                muteTrack.style.color = null;
                this.track.gainOutNode.gain.value = this.track.oldGainValue;
                this.track.setVolume(this.track.oldGainValue);
                this.track.unMute();
            } else {
                this.track.oldGainValue = this.track.gainOutNode.gain.value;
                muteTrack.style.color = "red";
                this.track.mute();
            }
        }
    }

    defineRemoveTrack() {
        this.shadowRoot.querySelector(".item.tool.close").onclick = () => {
            document.querySelector(`.wave-form.track${this.track.id}`).remove();
            this.remove();
            mainAudio.removeTrack(this.track);
        }
    }

    soloTrackListeners() {
        let soloTrack = this.shadowRoot.querySelector(".item.tool.solo");
        soloTrack.onclick = () => {
            if (this.track.isSoloTrack) {
                soloTrack.style.color = null;
                mainAudio.unSoloTrack(this.track);
            } else {
                soloTrack.style.color = "lime";
                this.track.setSoloTrack(true);
                mainAudio.soloTrack(this.track);
            }

        }
    }
}

