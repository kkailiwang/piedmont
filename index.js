var CLIENT_ID =
  "239112592362-oogbtgit5om42erh2676hq820v6vvvue.apps.googleusercontent.com";
var API_KEY = "AIzaSyD8JIqf1qEaiwTFKKuFYpTRsE2ek8S4oyE";
// // Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];

// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
// /**
//  *  On load, called to load the auth2 library and API client library.
//  */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

// /**
//  *  Initializes the API client library and sets up sign-in state
//  *  listeners.
//  */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      function() {},
      function(error) {
        console.log(error);
      }
    );
}

const base =
  "https://sheets.googleapis.com/v4/spreadsheets/11QHV5h0HGR1zfSQ3QpzztlTQkWm-GyK8H-IqT_zuvew/values/";

// ["6911336", "Kaili", "Wang", "$6.00", "2020-06-11 2:00:00", "FALSE"]
//define the index constants
const FIRST_NAME = 1;
const LAST_NAME = 2;
const AMOUNT = 3;
const DATE = 4;
const ANONYMOUS = 5;
const COMMENT = 6;

//for leaderboard
const donationsRange = "Donors!B2:H?key=";
axios
  .get(base + donationsRange + API_KEY)
  .then(res => {
    let rows = res.data.values;
    //example of a row:
    // ["6911336", "Kaili", "Wang", "$6.00", "2020-06-11 2:00:00", "FALSE", "comment goes here"]

    rows = rows.map(row => {
      // console.log(row[DATE].replace(' ', 'T'))
      const dateString = row[DATE].length < 19 ? row[DATE].replace(' ', 'T0') : row[DATE].replace(' ', 'T');
      let day = new Date(dateString);
      // console.log(day);
      let anon = row[ANONYMOUS] === "TRUE" ? true : false;

      let newRow = row;
      if (anon) {
        newRow[FIRST_NAME] = "Anonymous";
        newRow[LAST_NAME] = "";
      }
      newRow[AMOUNT] = Number(row[AMOUNT].substring(1));
      newRow[DATE] = day;
      newRow[ANONYMOUS] = anon;
      newRow[COMMENT] = row[COMMENT] == undefined ? "" : row[COMMENT];
      return newRow;
    });

    //now, rows would be like ["6911336", "Kaili", "Wang", 6.00, Date object, false]

    const leaders = $("#leader-list");

    const mostRecentButton = $("#most-recent-btn");
    const highestDonationsButton = $("#highest-donation-btn");
    const search = $("#fname");

    let highFilterOn = true;

    const displayLeaders = arr => {
      arr.map(function(row, i) {
        const name = `${row[FIRST_NAME]} ${row[LAST_NAME]}`;
        // const name = row[ANONYMOUS]  ? "Anonymous" : `${row[FIRST_NAME]} ${row[LAST_NAME]}`;
        let donation = `<div class="donation-elem"><span id="amount">$${row[3]} </span> by <span id="richfuck"> ${name}</span></div>`;
        let comment = `<div class="middle-comment"> ${row[COMMENT]}</div>`;
        let commentBottom = `<div class="bottom-comment"> ${row[COMMENT]}</div>`;

        //Jono:
        // you can do date.style._styleprop_ = 'propertyvalue'; like i did below with leader

        let day = row[DATE];
        console.log(day);
        console.log(day.getDate())
        var iOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (iOS) day.setDate(date.getDate() + 1);
        let date = `<div><span class="date-elem">${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}</span></div>`;
        let leader = `<div class="leader-elem">${donation}${comment}${date}</div>`;

        /*
              leader div
              ----------------------------------------------------
              | donation div                             date div |
              | |^^^^^^^^^^^^|                           |^^^^^^^||
              |  ^^^^^^^^^^^^                             ^^^^^^^ |
              ----------------------------------------------------
              */

        leaders.append(leader, commentBottom);
      });
    };
    const displayRecent = () => {
      highFilterOn = false;
      highestDonationsButton.removeClass("active-filter");
      mostRecentButton.addClass("active-filter");
      search.val("");
      leaders.html("");
      let newRows = rows.sort((a, b) => {
        return b[DATE] - a[DATE];
      });
      // console.log(newRows);
      displayLeaders(rows.slice(0, 30));
    };

    mostRecentButton.on("click", displayRecent);

    const displayHighest = () => {
      highFilterOn = true;
      highestDonationsButton.addClass("active-filter");
      mostRecentButton.removeClass("active-filter");
      search.val("");
      leaders.html("");
      let newRows = rows.sort((a, b) => b[AMOUNT] - a[AMOUNT]);
      console.log(newRows);
      displayLeaders(rows.slice(0, 30));
    };

    highestDonationsButton.on("click", displayHighest);
    //default
    highestDonationsButton.click();

    // SEARCHING

    search.on("input", e => {
      const keyword = e.target.value.toLowerCase();
      const filtered = rows.filter(row => {
        return (
          row[FIRST_NAME].toLowerCase().indexOf(keyword) >= 0 ||
          row[LAST_NAME].toLowerCase().indexOf(keyword) >= 0 ||
          `${row[FIRST_NAME]} ${row[LAST_NAME]}`.toLowerCase().indexOf(keyword) >= 0
        );
      });
      console.log(filtered);
      //keep track of which filter is used, then display
      leaders.html("");
      //rows should already be sorted correctly.
      displayLeaders(filtered.slice(0, 30));
    });
  })
  .catch(e => {
    console.log(e);
  });

//updating the total amount
const totalRange = "Main!A2?key=";
axios
  .get(base + totalRange + API_KEY)
  .then(res => {
    const total = res.data.values[0];
    console.log(res.data.values[0]);
    document.getElementById("bigmoney").innerHTML = total;
  })
  .catch(e => {
    console.log(e);
  });
