/**
 * Utilitary function to draw a waveFrom into a canvas with an audio Buffer
 * @param{HTMLCanvasElement} canvas
 * @param{AudioBuffer} buffer
 * @param{String} color
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
    canvas.bufferState = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

