var axios = require("axios");

let trimPlaylist = (playlists, payload) => {
  playlists.forEach((playlist) => {
    payload.push({
      name: playlist.name,
      external_urls: playlist.external_urls.spotify,
    });
  });

  return payload;
};

let getUserPlaylists = async (accessToken) => {
  let result = [];

  let response1;

  await axios({
    method: "get",
    url: "https://api.spotify.com/v1/me/playlists",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((res) => {
      response1 = res;
      result = trimPlaylist(res.data.items, result);
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  while (response1.data.next) {
    let response2;

    await axios({
      method: "get",
      url: response1.data.next,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => {
        response2 = res;
        result = trimPlaylist(res.data.items, result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });

    response1 = response2;
  }

  return result;
};

let getUserPlaylistsByID = async () => {
  console.log("getUserPlaylists");
};

module.exports = { getUserPlaylists, getUserPlaylistsByID };
