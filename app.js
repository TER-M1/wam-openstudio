const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 80;
const TRACK_PATH = './public/song/multitrack';
const LOCAL_TRACK_PATH = './song/multitrack';

let tracks = {};

const app = express();

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});


app.listen(PORT, () => console.log("Server is started and listening on port 80."));

/*
ROUTING
 */
app.get('/track', async (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    exploreMultiTracks();
    res.write(JSON.stringify(tracks));
    res.end();
});

app.get('/track/:id', async (req, res) => {
    const id = req.params.id;
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(getMutliTrackById(id)));
    res.end();
} )



const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1;

function isASoundFile(fileName) {
    if (endsWith(fileName, ".mp3")) return true;
    if (endsWith(fileName, ".ogg")) return true;
    if (endsWith(fileName, ".wav")) return true;
    return endsWith(fileName, ".m4a");
}

function exploreMultiTracks() {
    tracks = {"tracks": []};
    const directoryPath = TRACK_PATH;

    //passsing directoryPath and callback function
    var files = fs.readdirSync(directoryPath)
    let i = 0;
    files.forEach((file) => {
        var soundList = fs.readdirSync(`${directoryPath}/${file}`)
        const track = {
            id: i,
            trackname: file,
            path: `${LOCAL_TRACK_PATH}/${file}`,
            soundList: soundList
                .filter(sound => isASoundFile(sound))
                .map(sound => ({
                    name: sound
                }))
        }
        tracks.tracks.push(track);
        i++;
    })
}

function getMutliTrackById(id) {
    let res = {};
    tracks.tracks.forEach(track => {
        if (String(track.id) === id) {
            res = track;
        }
    })
    return res;
}

exploreMultiTracks();