import {AudioTrack} from "./audio_loader.js";
import {populateParamSelector} from "./plugin_parameters.js";

const mountPlugin = (mount, domModel) => {
    mount.innerHTML = '';
    mount.appendChild(domModel);
};

const uMountPlugin = (mount) => {
    mount.innerHTML = '';
}

function populateDropDown(track, mount,pluginParamSelector) {
    console.log(mount)
    // populateParamSelector(track.pluginInstance._audioNode,mount,pluginParamSelector)
}


class Selector {
    /**
     *
     * @type {[AudioTrack]}
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
                uMountPlugin(document.querySelector("#mount2"));
                let toRemoveSelectionCanvas = document.querySelector('.wave-form.mySelected');
                let toRemoveSElectionTrackElem = document.querySelector('.mySelected')
                if (toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null) {
                    toRemoveSElectionTrackElem.className = this.trackElementClass;
                    toRemoveSelectionCanvas.className = this.waveformClass + ' ' + toRemoveSelectionCanvas.id;
                }
                elem.className += this.selectClass;
                document.querySelector('.' + elem.id).className += this.selectClass;
                this.selectedTrack = this.getTrack(idTrack);
                console.log(elem.id)
                mountPlugin(document.querySelector("#mount2"), this.selectedTrack.pluginDOM);
                console.log("#pluginAutomationEditor" + elem.id)
                console.log(document.getElementById("#pluginAutomationEditor" + +elem.id))
                populateDropDown(this.selectedTrack, document.getElementById("#pluginAutomationEditor" + +elem.id),document.querySelector('#pluginParamSelector'));
            }
        })
        this.handlersCanvas();
        this.defineHandler();
    }


    handlersCanvas() {
        let elems = [];
        this.tracksId.forEach((id) => {
            let el = document.querySelectorAll(' .' + id);
            el.forEach((e) => {

                let idTrack = e.id.split('')[e.id.length - 1];
                e.onclick = () => {
                    uMountPlugin(document.querySelector("#mount2"));
                    let toRemoveSelectionCanvas = document.querySelector('.wave-form.mySelected');
                    let toRemoveSElectionTrackElem = document.querySelector('.mySelected')
                    if (toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null) {
                        toRemoveSElectionTrackElem.className = this.trackElementClass
                        toRemoveSelectionCanvas.className = this.waveformClass + ' ' + toRemoveSelectionCanvas.id
                    }
                    e.className += this.selectClass;
                    document.querySelector('#' + e.id).className += this.selectClass;
                    this.selectedTrack = this.getTrack(idTrack);
                    console.log(this.selectedTrack.pluginDOM);
                    mountPlugin(document.querySelector("#mount2"), this.selectedTrack.pluginDOM);
                    // populateDropDown(this.selectedTrack);
                }
                elems.push(e);
            })
        });
        // console.log(elems)
    }

    getTrack(id) {
        let track = undefined;
        this.tracks.forEach((t) => {
            if (String(t.id) == id) {
                track = t;
            }

        })
        return track;
    }
    defineHandler(){
        this.automation.onclick = () => {
            console.log("hello aut")

        }
    }

}

export {Selector} ;
