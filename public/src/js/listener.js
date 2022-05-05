import {AudioTrack} from "./audio_loader.js";

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

    constructor(tracks = []) {
        this.tracks = tracks;
        let trackDivs = document.querySelectorAll(".track-element");
        trackDivs.forEach((elem) => {
            this.tracksId.push(elem.id);
            let idTrack = elem.id.split('')[elem.id.length-1];
            elem.onclick = () => {
                let toRemoveSelectionCanvas =  document.querySelector('.wave-form.mySelected');
                let toRemoveSElectionTrackElem = document.querySelector('.mySelected')
                if(toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null ){
                    toRemoveSElectionTrackElem.className = this.trackElementClass;
                    toRemoveSelectionCanvas.className = this.waveformClass +' '+  toRemoveSelectionCanvas.id};
                elem.className += this.selectClass;
                document.querySelector('.'+elem.id).className += this.selectClass;
                this.selectedTrack = this.getTrack(idTrack);
            }
        })
        this.handlersCanvas();
    }


    handlersCanvas() {
        let elems = [];
        this.tracksId.forEach((id) => {
            let el =  document.querySelectorAll(' .'+id);
            el.forEach((e) => {

                let idTrack = e.id.split('')[e.id.length-1];
                e.onclick = () => {
                    let toRemoveSelectionCanvas =  document.querySelector('.wave-form.mySelected');
                    let toRemoveSElectionTrackElem = document.querySelector('.mySelected')
                    if(toRemoveSelectionCanvas !== null && toRemoveSElectionTrackElem !== null ){
                        toRemoveSElectionTrackElem.className = this.trackElementClass
                        toRemoveSelectionCanvas.className = this.waveformClass +' '+  toRemoveSelectionCanvas.id}
                    e.className += this.selectClass;
                    document.querySelector('#'+e.id).className += this.selectClass;
                    this.selectedTrack = this.getTrack(idTrack);
                    console.log(this.selectedTrack)

                }
                elems.push(e);
            })
        });
        // console.log(elems)
    }
    getTrack(id){
        let track = undefined;
        this.tracks.forEach((t) => {
            if(String(t.id) == id){
                track =  t;
            }

        })
        return track;
    }

}
export{Selector} ;
