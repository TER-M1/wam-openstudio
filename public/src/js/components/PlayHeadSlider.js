const template = document.createElement("template");

template.innerHTML = /*html*/`
<style>
    .slider {
        width: 100%;
        height: 26px;
        background-color: #a49f9f;
    }
    
    .thumb {
        width: 10px;
        height: 10px;
        /*background-color: transparent;*/
        position: absolute;
    }

    
</style>

<div class="slider">
    <div class="thumb my">
        <svg id="svg" xmlns="http://www.w3.org/2000/svg" width="10" height="200" version="1.1">
            <polygon points="0 0, 0 10, 5 15, 10 10, 10 0" fill="lightgrey"/>
            <line id="svg-line" x1="5" y1="0" x2="5" y2="200" style="stroke-width: 1; stroke: lightgrey;"/>
        </svg>
    </div>
</div>
`;

export default class PlayHeadSlider extends HTMLElement {
    min = 0;
    max = 10;
    step = 1;
    start = 1;
    pressed = false;
    originalX = undefined;
    sliderPos = undefined;
    sliderWidth = undefined;
    viewport_width = document.documentElement.clientWidth;
    viewport_height = document.documentElement.clientHeight;
    parentHeight  = undefined;
    svgLine = undefined;
    svg= undefined;

    _sliderValue = undefined;
    /**
     *
     * @type {Element}
     */
    slider = undefined;

    /**
     *
     * @type {Element}
     */
    thumb = undefined;

    /**
     *
     * @type {MainAudio}
     */
    mainaudio = undefined;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    /**
     *
     * @returns {number}
     */
    get _sliderValue() {
        return this._sliderValue;
    }

    connectedCallback() {
        this.min = this.attributes.min.value;
        this.max = this.attributes.max.value;
        this.step = this.attributes.step.value;
        this.start = this.attributes.start.value;
        this.shadowRoot.innerHTML = template.innerHTML;
        this._sliderValue = this.start;
        this.slider = this.shadowRoot.querySelector(".slider");
        this.thumb = this.shadowRoot.querySelector(".thumb");

        this.svgLine = this.shadowRoot.querySelector("#svg-line");
        this.svg = this.shadowRoot.querySelector("#svg");
        this.parentHeight = this.parentElement.getBoundingClientRect().height;
        this.svg.setAttribute("height", this.parentHeight-15);
        this.svgLine.setAttribute("y2", this.parentHeight-15);
        this.sliderPos = this.slider.getBoundingClientRect().left;
        this.sliderWidth = this.slider.getBoundingClientRect().width;

        this.handleThumbDrag();
        this.handleSliderDrag();
        this.documentHandler();
    }


    disconnectedCallback() {
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

    }

    activateSlider(ev) {
        this.sliderPos = this.slider.getBoundingClientRect().left;
        this.sliderWidth = this.slider.getBoundingClientRect().width;
        this.pressed = true;
        this.originalX = ev.clientX;
    }

    moveThumb(ev) {
        let offset = ev.clientX + window.scrollX;
        if (offset < this.sliderPos) offset = this.sliderPos;
        else if (offset > this.sliderWidth+10) offset = this.sliderWidth+10;
        this.thumb.style.left = offset-5+"px";
    }

    moveThumbWhenSlide(move) {
        let currentLeft = Number(this.thumb.style.left.replace("px", ''));
        this.thumb.style.left = currentLeft+move+"px";
    }

    changeSizeSlider() {
        // let height = document.querySelector(".audio-tracks").getBoundingClientRect().height;
        // this.svg.setAttribute("height", height-15);
        // this.svgLine.setAttribute("y2", height-15);
    }

    changeValue(value) {
        this._sliderValue = value;
        let approximate = Math.round(this._sliderValue/this.step)*this.step
        let approxPixel = (approximate*this.sliderWidth)/this.max;
        let newPos = approxPixel + this.sliderPos - 5;
        this.thumb.style.left = newPos+"px";
    }

    getNewValue() {
        let pos = Math.min(
            this.thumb.getBoundingClientRect().left - this.sliderPos + 5,
            this.sliderWidth
        )
        this._sliderValue = (pos*this.max) / this.sliderWidth;
        let approximate = Math.round(this._sliderValue/this.step)*this.step
        let approxPixel = (approximate*this.sliderWidth)/this.max;
        let newPos = approxPixel + this.sliderPos - 5;
        this.thumb.style.left = newPos+"px";
        console.log(this._sliderValue);
    }

    documentHandler() {
        document.addEventListener("mouseup", () => {
            if (this.pressed) {
                this.pressed = false;
                this.getNewValue();
            }
        });
        document.addEventListener("mousemove", (ev)=>{
            if (this.pressed) {
                this.moveThumb(ev);
            }
        });
        window.onresize = (ev) => {
            this.viewport_width = document.documentElement.clientWidth;
            this.viewport_height = document.documentElement.clientHeight;
            this.svg.setAttribute("height", this.viewport_height-15);
            this.svgLine.setAttribute("y2", this.viewport_height-15);
        }
        window.onload = () => {
            let height = document.querySelector(".audio-tracks").getBoundingClientRect().height;
            this.viewport_width = document.documentElement.clientWidth;
            this.viewport_height = document.documentElement.clientHeight;
            // this.svg.setAttribute("height", height-15);
            // this.svgLine.setAttribute("y2", height-15);
        }
    }

    handleThumbDrag() {
        this.thumb.addEventListener("mousedown", (ev)=> {
            this.activateSlider(ev);
        });
    }

    handleSliderDrag() {
        this.slider.addEventListener("click", (ev)=> {
            this.moveThumb(ev)
            this.getNewValue();
        });

        this.slider.addEventListener("mousedown", (ev)=> {
            this.activateSlider(ev);
        });
    }
}

customElements.define("playhead-slider", PlayHeadSlider);
