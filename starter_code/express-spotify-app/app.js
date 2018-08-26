const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();

// Remember to paste here your credentials
const clientId = "faf1f96502154ec89177dfacb8d3484b";
clientSecret = "ff46b976981c46f696204736fe0270b1";

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function(data) {
        spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function(err) {
        console.log("Something went wrong when retrieving an access token", err);
    }
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views/layouts");
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/artist", (req, res) => {
    const { artist } = req.query;
    // console.log(artist);

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            res.render("artist", { data: data.body.artists.items });
            console.log(data.body.artists.items);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/albums/:artistId", (req, res) => {
    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId).then(
        data => {
            res.render("albums", { data: data.body.items });
        },
        function(err) {
            console.error(err);
        }
    );
});

app.get("/tracks/:albumId", (req, res) => {
    const albumId = req.params.albumId;
    console.log(albumId);
    spotifyApi.getAlbumTracks(albumId).then(
        data => {
            res.render("tracks", { data: data.body.items });
        },
        function(err) {
            console.log("Something went wrong!", err);
        }
    );
});

app.listen(3000);
