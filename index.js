// import axios from 'axios';
// require('babel-polyfill');

const username = 'https://mayaguzdar@gmail.com';
const donorboxApi = 'm4aZVnvnmiDM_KFJndoLBU-quNstCQJRcx8HljU5yaia0GLaMjyjtg';
const BASE_URL = 'https://mayaguzdar%40gmail.com:' + donorboxApi + '@donorbox.org/api/v1';
const noApi = 'https://donorbox.org/api/v1';
var headers = new Headers();

headers.append('Authorization', 'Basic ' + btoa(username + ':' + donorboxApi));

const getCampaign = () => {
  try {
    // axios.get(`${BASE_URL}/campaigns`).then(res => {
    //     const campaigns = res.data;
    //     console.log(`GET: Here's the list of campaigns`, campaigns);
    //     return campaigns;
    // }).catch( err => {
    //     console.log(err);
    // });

    fetch(noApi + '/campaigns', {headers: headers}).then( res => {
        console.log(res.data);
    })

    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open( "GET", BASE_URL+'/campaigns', false, 'mayaguzdar@gmail.com', donorboxApi ); // false for synchronous request
    // xmlHttp.send( null );
    // console.log(xmlHttp.responseText);

    


  } catch (e) {
    console.error(e);
  }
};

const main = () => {
    getCampaign();
};

main();

//google sheet api client: 239112592362-oogbtgit5om42erh2676hq820v6vvvue.apps.googleusercontent.com

//client secret: vHExiF9Jqoa2wrPU4UjV3GUs

//api key: AIzaSyCoB7rCCVBJeAKwSMrWgRB0U6Hb7-pAxg4