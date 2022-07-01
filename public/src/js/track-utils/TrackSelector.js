import {populateParamSelector} from "../automation/PluginParameters.js";
import {mainAudio} from "../audio/Utils.js";

const mountPlugin = (mount, domModel) => {
    mount.innerHTML = '';
    mount.appendChild(domModel);
};

const uMountPlugin = (mount) => {
    mount.innerHTML = '';
}


export function populateDropDown(track, mount, pluginParamSelector) {
    if (track.hasPlugin) {
        track.pluginInstance._audioNode.addEventListener("wam-info", () =>
            populateParamSelector(track.pluginInstance._audioNode, mount, pluginParamSelector, track)
        );
    }
}

export default class TrackSelector {
    /**
     *
     * @type {AudioTrack}
     */
    selectedTrack = undefined;

    tracks = [];
    tracksId = [];
    waveformClass = "wave-form"
    trackElementClass = "track-element"
    selectClass = " mySelected"
    automation = document.querySelector(".auto.ui.dropdown");

    constructor(tracks = []) {

        this.tracks = tracks;
        let trackDivs = document.querySelectorAll(".track-element");
        let addPlugin = document.querySelector("#add-remove-plugins");

        trackDivs.forEach((elem) => {
            this.tracksId.push(elem.id);
            let idTrack = elem.id.split('')[elem.id.length - 1];
            elem.onclick = () => {
                if (this.getTrack(idTrack) !== this.selectedTrack) {
                    addPlugin.className = "item";
                    uMountPlugin(document.querySelector("#mount1"));
                    let toRemoveSelectionCanvas = document.querySelector('.wave-form.mySelected');
                    let toRemoveSElectionTrackElem = document.querySelector('.mySelected');
                    if (toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null) {
                        toRemoveSElectionTrackElem.className = this.trackElementClass;
                        toRemoveSelectionCanvas.className = this.waveformClass + ' ' + toRemoveSelectionCanvas.id;
                    }
                    elem.className += this.selectClass;
                    document.querySelector('.' + elem.id).className += this.selectClass;
                    this.selectedTrack = this.getTrack(idTrack);
                    mainAudio.selectedTrack = this.selectedTrack;
                    if (this.selectedTrack.hasPlugin) {
                        mountPlugin(document.querySelector("#mount1"), this.selectedTrack.pluginDOM);
                        addPlugin.firstElementChild.className = "minus icon";
                    }
                    else {
                        addPlugin.firstElementChild.className = "plus icon";
                    }
                }
            }
        })
    }

    getTrack(id) {
        let track = undefined;
        this.tracks.forEach((t) => {
            if (String(t.id) === id) {
                track = t;
            }

        })
        return track;
    }
}