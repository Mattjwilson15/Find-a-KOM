"use strict";

let lat = -36.922086;
let lon = 174.507962;
let minCat = 0;
let maxCat = 5;
let climb = false;
let flat = false;
let pLineGroup = L.layerGroup();

const map = L.map("map").setView([lat, lon], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// set up map//
// function getPosition(position) {
//   lat = position.coords.latitude;
//   lon = position.coords.longitude;
//   console.log(lat, lon);
// }
// navigator.geolocation.getCurrentPosition(getPosition);
// when search button clicked//

document
  .getElementById("searchSegments")
  .addEventListener("click", function () {
    pLineGroup.eachLayer(function (layer) {
      //removes all old drawn lines//
      pLineGroup.removeLayer(layer);
    });
    //assign inputed info//
    const effortTime = Number(document.getElementById("effortTime").value);
    const effortPower = Number(document.getElementById("effortPower"));
    const minElevation = document.getElementById("minElevation");
    const maxElevation = document.getElementById("maxElevation");
    climb = document.getElementById("climb").checked;
    flat = document.getElementById("flat").checked;
    reAuthorize();
  });

const authLink = "https://www.strava.com/oauth/token";

function getSegments(res) {
  ///mapgrids//

  // //top left//
  // let tLeftLat = map.getBounds().getNorthWest().lat;
  // let tLeftLng = map.getBounds().getNorthWest().lng;
  // //top right//
  // let tRightLat = map.getBounds().getNorthEast().lat;
  // let tRightLng = map.getBounds().getNorthEast().lng;
  // //bottom left//
  // let bLeftLat = map.getBounds().getSouthWest().lat;
  // let bLeftLng = map.getBounds().getSouthWest().lng;
  // //bottom right//
  // let bRightLat = map.getBounds().getSouthEast().lat;
  // let bRightLng = map.getBounds().getSouthEast().lng;

  // let yDif = (tRightLng - tLeftLng) / 2;

  // console.log(tLeftLng, tRightLng);
  // console.log((tRightLng - tLeftLng) / 2);

  // let xDif = (tLeftLat - bLeftLat) / 2;

  // console.log(tLeftLat, bLeftLat);
  // console.log((tLeftLat - bLeftLat) / 2);

  // let baseTRLng = tLeftLng + yDif;
  // let baseBLLng = bLeftLng;

  //climb or flat//
  if (climb) {
    minCat = 1;
    maxCat = 5;
  } else if (flat) {
    minCat = 0;
    maxCat = 0;
  }

  //

  console.log(minCat, maxCat);

  console.log(res.access_token);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${res.access_token}`);
  myHeaders.append(
    "Cookie",
    "_strava4_session=8th1376jpa9euel1512elt9t0opk6nfb"
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // for (let i = 0; i < 2; i++) {
  fetch(
    `https://www.strava.com/api/v3/segments/explore?bounds=${
      //bottom left
      map.getBounds().getSouthWest().lat
    },${map.getBounds().getSouthWest().lng},${
      //top right
      map.getBounds().getNorthEast().lat
    },${
      map.getBounds().getNorthEast().lng
    }&activity_type=riding&min_cat=${minCat}&max_cat=${maxCat}`,
    requestOptions
  )
    .then((res) => res.json())
    .then(function (data) {
      for (let i = 0; i < data.segments.length; i++) {
        fetch(
          `https://www.strava.com/api/v3/segments/${data.segments[i].id}`,
          requestOptions
        )
          .then((res) => res.json())
          .then(function (data) {
            console.log(data.xoms.kom);
          });
      }

      for (let i = 0; i < data.segments.length; i++) {
        let coordinates = L.Polyline.fromEncoded(
          data.segments[i].points
        ).getLatLngs();

        pLineGroup.addLayer(
          L.polyline(coordinates, {
            color: "red",
            weight: 2.5,
            opacity: 0.7,
            linejoin: "round",
          })
        );
        pLineGroup.addTo(map);
      }
    });
}

function reAuthorize() {
  fetch(authLink, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      client_id: "87561",
      client_secret: "f561f83ce7a5bc2bb3f7d12a7133b9f41f8bd833",
      refresh_token: "27a7b13608b3293b0e4a70c49f7c22460ec4b207",
      grant_type: "refresh_token",
    }),
  })
    .then((res) => res.json())
    .then((res) => getSegments(res));
}

//test button for any function//
document.getElementById("test").addEventListener("click", function () {
  for (let i = 0; i < 2; i++) {
    console.log(i);
  }
});

// //when climb or flat box ticked//
// climbTickBox.addEventListener("change", function () {});

// flatTickBox.addEventListener("change", function () {});
