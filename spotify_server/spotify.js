var axios = require("axios");

// axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

let trimPlaylist = (playlists) => {
  let result = [];
  playlists.forEach((playlist) => {
    // result.push({playlist.name, playlist.external_urls.spotify});
    result.push({
      name: playlist.name,
      external_urls: playlist.external_urls.spotify,
    });
    
  });
  return result;
};

let getUserPlaylists = async (accessToken) => {
  var config = {
    method: "get",
    url: "https://api.spotify.com/v1/me/playlists",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  return await axios(config)
    .then((response) => {
      return trimPlaylist(response.data.items);
    })
    .catch((error) => {
      console.log(error);
    });
};

let getUserPlaylistsByID = async () => {
  console.log("getUserPlaylists");
};

module.exports = { getUserPlaylists, getUserPlaylistsByID };
