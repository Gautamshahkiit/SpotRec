import React, { useState, useFetch } from "react";


export default function Spotify() {

  let [data, setData] = useState([]);

  let getData = () => {
    let url = "https://";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
  };
  useFetch( () => {
    getData();
  })

  return <div>
    data.for
  </div>;
}
