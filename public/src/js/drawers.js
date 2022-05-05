export class LineDrawer {
    _paused = false;
    _duration = 0.0;
    _x = 0;
    _launched = false;

    /**
     *
     * @param{Element} canvas
     */
    constructor(canvas) {
        this._canvas = canvas;
    }

    get launched() {
        return this._launched;
    }

    set launched(value) {
        this._launched = value;
    }

    get paused() {
        return this._paused;
    }

    set paused(value) {
        this._paused = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    /**
     *
     * @param decodedAudioBuffer
     */
    drawLine(decodedAudioBuffer) {
        this._launched = true;
        var ctx = this._canvas.getContext("2d");
        this._x = 0;
        // @ts-ignore
        var y = 50;
        // @ts-ignore
        var width = 10;
        // @ts-ignore
        var height = 10;
        let speed = 33;
        let delta = 0.01; // the time spent in the function animate // empirical value i have to do it better

        const animate = () => {
            //speed Calculation for the line:
            if (this._duration == 0) {
                console.error("duration not defined for this sound.");
            } else {
                speed = (this._duration / (this._canvas.width / 2)) * 1000;
            }
            if (!this._paused) {
                ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo(this._x, 0);
                ctx.lineTo(this._x, this._canvas.height);
                ctx.stroke();
                this._x += 2;
            }
            if (this._x <= this._canvas.width) {
                setTimeout(animate, speed - delta);
            }
            if (this._x > this._canvas.width) {
                this._launched = false;
            }
        }

        animate();
    }
}

/**
 *
 * @param canvas
 * @param buffer
 * @param color
 * @param width
 * @param height
 */
export function drawBuffer(canvas, buffer, color) {
    let width = canvas.width;
    let height = canvas.height;

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (color) {
        ctx.fillStyle = color;
    }
    var data = buffer.getChannelData(0);
    var step = Math.ceil(data.length / width);
    var amp = height / 2;
    for (var i = 0; i < width; i++) {
        var min = 1.0;
        var max = -1.0;
        for (var j = 0; j < step; j++) {
            var datum = data[i * step + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
    canvas.bufferState = ctx.getImageData(0,0,canvas.width,canvas.height);
}

