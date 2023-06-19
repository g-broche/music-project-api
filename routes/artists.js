var express = require('express');
var router = express.Router();

const Artist = require('../models/Artist')

router.get('/', async function (req, res, next) {
    const artists = await Artist.find({})
    res.send(artists);
});
router.get('/name/:name', async function (req, res, next) {
    const artists = await Artist.find({ "name": { "$regex": req.params.name } })
    res.send(artists);
});
router.get('/:id', async (req, res, next) => {
    const artist = await Artist.findOne({ "_id": req.params.id })
    const album = artist.albums[req.params.n]
    res.send(album)
})
router.get('/:id/duration', async (req, res, next) => {
    let totalDuration = 0;
    const artist = await Artist.findOne({ "_id": req.params.id })
    artist.albums.forEach(album => {
        album.tracks.forEach(track => {
            totalDuration += track.duration
        })
    });
    let totalDurationString = (Math.floor(totalDuration / 60)) + ":" + (totalDuration % 60)
    res.send("La durée totale de la playlist pour " + artist.name + " est de " + totalDurationString + ".")
})
router.get('/albums/:date', async (req, res, next) => {
    const artists = await Artist.find({ "albums.year": { $gte: parseInt(req.params.date) } })
    let nameArray = []
    artists.forEach(artist => {
        nameArray.push(artist.name)
    });
    res.send(nameArray)
})

router.get('/country/:country', async (req, res, next) => {
    const artists = await Artist.find({ country: req.params.country })
    let nameArray = []
    artists.forEach(artist => {
        nameArray.push(artist.name)
    });
    res.send(nameArray)
})

router.get('/:id/tracks', async (req, res, next) => {
    const artist = await Artist.findOne({ "_id": req.params.id })
    let songArray = []
    artist.albums.forEach(album => {
        album.tracks.forEach(track => {
            songArray.push(track)
        })
    });
    songArray.sort((trackA, trackB) => trackB.nbHits - trackA.nbHits)

    res.send(songArray)
})

router.post('/add/', async (req, res, next) => {
    const newArtist = new Artist()
    newArtist.name = req.body.name
    newArtist.country = req.body.country
    newArtist.albums = []
    newArtist.save()
    res.send(newArtist + "a été ajouté")
}
)
router.post('/:id/albums/add/', async (req, res, next) => {
    try {
        let artistId = req.params.id
        let newAlbum = {
            name: req.body.albumTitle,
            year: req.body.year,
            tracks: []
        }
        const targetArtist = await Artist.findByIdAndUpdate(
            artistId,
            { $push: { albums: newAlbum } },
            { new: true }
        );
        res.status(201).json(targetArtist.albums)
    } catch (err) {
        res.status(500).json({ error: "Oops! something went wrong!" })
    }
}
)
router.post('/:id/albums/:name/tracks/add', async (req, res, next) => {
    try {
        let artistId = req.params.id
        let albumName = req.params.name
        let newTrack = {
            name: req.body.trackTitle,
            duration: req.body.duration,
            nbHits: 0,
        }

        const targetArtist = await Artist.findOne({ "_id": artistId })

        targetArtist.albums.find(album => album.title === albumName).tracks.push(newTrack)
        targetArtist.markModified("albums")
        targetArtist.save()

        res.status(201).json(targetArtist.albums)

    } catch (err) {
        res.status(500).json({ error: err })
    }
}
)

module.exports = router;
