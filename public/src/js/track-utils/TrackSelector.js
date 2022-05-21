import {populateParamSelector} from "../automation/PluginParameters.js";

/**
 * This function helps to attach the DOM of the plugin to the web page
 * @param mount
 * @param domModel
 */
const mountPlugin = (mount, domModel) => {
    mount.innerHTML = '';
    mount.appendChild(domModel);
};
/**
 * this function clear the proper mounting div by removing the html of the plugin in the webpage
 * @param mount
 */
const uMountPlugin = (mount) => {
    mount.innerHTML = '';
}


/**
 * this function calls a filler for the dropdown to update the available parameter of the plugin
 * @param track
 * @param mount
 * @param pluginParamSelector
 */
function populateDropDown(track, mount, pluginParamSelector) {
    populateParamSelector(track.pluginInstance._audioNode, mount, pluginParamSelector, track);
}


export default class TrackSelector {
    /**
     * this class is the handler for clicks on the track, it registers
     * the given track and mount the associated plugin into the webpage
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
        trackDivs.forEach((elem) => {
            this.tracksId.push(elem.id);
            let idTrack = elem.id.split('')[elem.id.length - 1];
            elem.onclick = () => {
                uMountPlugin(document.querySelector("#mount1"));
                let toRemoveSelectionCanvas = document.querySelector('.wave-form.mySelected');
                let toRemoveSElectionTrackElem = document.querySelector('.mySelected')
                if (toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null) {
                    toRemoveSElectionTrackElem.className = this.trackElementClass;
                    toRemoveSelectionCanvas.className = this.waveformClass + ' ' + toRemoveSelectionCanvas.id;
                }
                elem.className += this.selectClass;
                document.querySelector('.' + elem.id).className += this.selectClass;
                this.selectedTrack = this.getTrack(idTrack);
                let can = document.querySelector(`.wave-form.${elem.id}`);
                mountPlugin(document.querySelector("#mount1"), this.selectedTrack.pluginDOM);
                // console.log(this.selectedTrack.bpf)
                populateDropDown(this.selectedTrack, this.selectedTrack.bpf, document.querySelector('.ui.dropdown.auto'));
            }
        })
        this.handlersCanvas();
        this.defineHandler();
    }

    /**
     * this method is the definition of the clicks handler for each canvas
     */
    handlersCanvas() {
        let elems = [];
        this.tracksId.forEach((id) => {
            let el = document.querySelectorAll(' .' + id);
            el.forEach((e) => {

                let idTrack = e.id.split('')[e.id.length - 1];
                e.onclick = () => {
                    uMountPlugin(document.querySelector("#mount1"));
                    let toRemoveSelectionCanvas = document.querySelector('.wave-form.mySelected');
                    let toRemoveSElectionTrackElem = document.querySelector('.mySelected')
                    if (toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null) {
                        toRemoveSElectionTrackElem.className = this.trackElementClass
                        toRemoveSelectionCanvas.className = this.waveformClass + ' ' + toRemoveSelectionCanvas.id
                    }
                    e.className += this.selectClass;
                    document.querySelector('#' + e.id).className += this.selectClass;
                    this.selectedTrack = this.getTrack(idTrack);
                    mountPlugin(document.querySelector("#mount1"), this.selectedTrack.pluginDOM);
                    let can = document.querySelector(`.wave-form.${e.id}`);
                    populateDropDown(this.selectedTrack, this.selectedTrack.bpf, document.querySelector('.ui.dropdown.auto'));

                }
                elems.push(e);
            })
        });
        // console.log(elems)
    }

    /**
     *
     * @param id
     * @returns {AudioTrack}
     */
    getTrack(id) {
        let track = undefined;
        this.tracks.forEach((t) => {
            if (String(t.id) == id) {
                track = t;
            }

        })
        return track;
    }

    pop() {
        let can = document.querySelector(`.wave-form.track${this.selectedTrack.id}`);
        console.log(can)
        populateDropDown(this.selectedTrack, this.selectedTrack.bpf, document.querySelector('.ui.dropdown.auto'));
    }


    defineHandler() {
        this.automation.addEventListener("click", () => {
            console.log("need to update teh dropdown here too without deelting it ")
        })

    }

}