//You can edit ALL of the code here
const searchBox = document.getElementById("search");
const episodesDropdwon = document.getElementById("showlist");
const showsDropdown = document.getElementById("allshows")
let allEpisodes = null;
let allShows = null;

// runs once,only when page loads.
function setup() {
  allShows = getAllShows();
  const sortedAllShows = allShows.sort((a,b)=>{
   return a.name < b.name ?-1:1
  })
  createShowsDropdownOptions(sortedAllShows);
  populateCards(sortedAllShows,"show")
}

// I need to get my data from API,beacuse promise is an async function
// so it goes to the next line.
// but still we doesnt have any data 
// for solving that I need to do the second promise in my setup function

function getEpisodes(showId){
  const endpoint = `https://api.tvmaze.com/shows/${showId}/episodes`
 return fetch(endpoint)
  .then(response=> response.json()) 
}


// for search
// first I need to create input search in my html
// then I need a refrence to it
// so whenever I type in input box,I need to listen to it
// then filter the list with the value of the input against name OR summary fields
// then call populateCards function with filtered array
// The display should update immediately after each keystroke changes the input.using keyup
searchBox.addEventListener("input", (e) => {
  let searchPhrase = e.target.value.toLowerCase();
  let searchResult = search(searchPhrase, allEpisodes);
  populateCards(searchResult);
  displayCount(searchResult);
});

function search(phrase, episodes) {
  const filteredEpisodes = episodes.filter((episode) => {
    const {name,summary} = episode ;
    return name.toLowerCase().includes(phrase) || summary.toLowerCase().includes(phrase);
  });
  return filteredEpisodes;
}

// this function calculate length of both searched and allEpisodes arrays.
// and display them on the screen.
function displayCount(searchedEpisodes) {
  const displayCountEl = document.getElementById("result-count");
  const totalEpisodesLength = allEpisodes.length;
  const searchedEpisodesLength = searchedEpisodes.length;
  displayCountEl.innerText = `Displaying ${searchedEpisodesLength}/${totalEpisodesLength} episodes`;
}

function removeDisplatCount(){
  const displayCountEl = document.getElementById("result-count");
  displayCountEl.innerText = ""
}

function concatinateSeasonAndNumber(episode) {
  //  unpacking, when I want property from an object we can create a variable like this.
  const {season,number} = episode ; 
  let result = "";
  result += season < 10 ? `S0${season}` : `S${season}`;
  result += number < 10 ? `E0${number}` : `E${number}`;
  return result;
}


function createOptionForShowList(episode){
const option = document.createElement("option")
option.setAttribute("value", episode.id)
option.innerText = episode.name
return option
}

function createShowsDropdownOptions (allEpisodes){
  showsDropdown.appendChild(createOptionForShowList({name:"all shows", id:"all"}))
  allEpisodes.forEach(episode =>{
    const option= createOptionForShowList(episode)
    showsDropdown.appendChild(option)
  })
}

showsDropdown.addEventListener("change",e =>{
  let showId = e.target.value ;
  // location.href = `#${value}`
  if(showId === "all"){
    populateCards(allShows,"show");
    removeDisplatCount()
    makeEpisodeList([]);
  }else{
    getEpisodes(showId).then(data=>{
    allEpisodes = data
    populateCards(allEpisodes);
    // for first time we havent searched anything,so it means
    // we can pass allEpisodes array as a search result.(73/73)
    displayCount(allEpisodes);
    makeEpisodeList(allEpisodes);
 })
  }
})

function createOption(episode) {
  const option = document.createElement("option");
  option.setAttribute("value", episode.id);
  let title = concatinateSeasonAndNumber(episode);
  option.innerText = title + `-${episode.name}`;
  return option;
}

function makeEpisodeList(allEpisodes) {
  episodesDropdwon.innerHTML= ""
  allEpisodes.forEach((episode) => {
    const option = createOption(episode);
    episodesDropdwon.appendChild(option);
  });
}

episodesDropdwon.addEventListener("change", (e) => {
  let value = e.target.value;
  console.log(value)
  // this property will set the href value to point to an anchor
  location.href = `#${value}`;
  let selectedCard = document.getElementById(value); 
  selectedCard.classList.add("card--active");
  setTimeout(()=>{
      selectedCard.classList.remove("card--active")
  },2000)
});

function createCard(episode,type) {
  const li = document.createElement("li");
  const cardTitleWrapper = document.createElement("div");
  const episodeTitle = document.createElement("p");
  const image = document.createElement("img");
  const description = document.createElement("p");
  const link= document.createElement("a");

  li.setAttribute("class", "card");
  cardTitleWrapper.setAttribute("class", "card-title-wrapper");

  episodeTitle.setAttribute("class", "episode-title");

  // adding this variable cause later when user clicks on select options
  // we expect page scroll down to the correspondent card
  // so in this case card needs id equal to the value of the option.

  li.setAttribute("id", episode.id);
  if (type !== "show") {
    let title = concatinateSeasonAndNumber(episode);
    episodeTitle.innerText = episode.name + "-" + title;
  } else {
    episodeTitle.innerText = episode.name;
  }
  

  image.setAttribute("class", "card-img");
  image.setAttribute("src",  episode.image ? episode.image.medium: "");

  description.setAttribute("class", "card-desc");
  description.innerHTML = episode.summary;

  link.setAttribute("class","imageLink")
  link.href = episode.url ;
  link.innerHTML = "Watch me";
 
 
  cardTitleWrapper.appendChild(episodeTitle);
  li.appendChild(cardTitleWrapper);
  li.appendChild(image);
  li.appendChild(description);
  li.appendChild(link);
  return li;
}

// to clear all cards from the DOM. inorder to add new cards.
// this function need to be called inside  populateCards function
function clearCards(ul) {
  ul.innerHTML = "";
}

function populateCards(episodeList,type) {
  const ul = document.getElementById("cards");
  clearCards(ul);
  episodeList.forEach((episode) => {
    const li = createCard(episode,type);
    ul.appendChild(li);
  });
}

window.onload = setup;