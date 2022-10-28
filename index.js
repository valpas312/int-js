//Cosas para las llamadas a la api
const API_KEY = "api_key=49d66778051a2807846fe062c8ed8b6f";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_SRC = "https://image.tmdb.org/t/p/w500";

const searchURL = BASE_URL + "/search/movie?" + API_KEY;

//Cosas del DOM
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const title = document.querySelector(".title");
const tags = document.getElementById("tags");

getMovies(API_URL);

//Filtrador de generos
let selectedGenre = [];
setGenre();
function setGenre() {
  tags.innerHTML = "";

  genres.forEach((genre) => {
    const div = document.createElement("div");
    div.classList.add("tag");
    div.id = genre.id;
    div.innerText = genre.name;
    div.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.entries(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      //Pedimos a la API las peliculas con el genero elegido
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      genreSelection();
    });
    tags.appendChild(div);
  });
}

//Funcion para estilar genero elegido
function genreSelection() {
  const genres = document.querySelectorAll(".selected");
  genres.forEach((genre) => {
    genre.classList.remove("selected");
  });

  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const selectedGenre = document.getElementById(id);
      selectedGenre.classList.add("selected");
    });
  }
}

//Fetch
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showMovies(data.results);
    });
}

//Funcion para renderizar html
const showMovies = (data) => {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, backdrop_path, vote_average, overview } = movie;
    const movieRender = document.createElement("div");
    movieRender.classList.add("movie");
    movieRender.innerHTML = `
        <img src="${IMG_SRC + backdrop_path}"
                alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                ${overview}
            </div>
        `;

    main.appendChild(movieRender);
  });
};

//Funcion para el rating
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  }
  return "red";
}

//Buscador
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (title) {
    title.innerHTML = `Results of "${search.value}"...`;
  }

  const searchTerm = search.value;

  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  }
});
