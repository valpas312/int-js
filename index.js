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
const genreShow = document.getElementById('genreShow')
const tag = document.getElementsByClassName('tag')

//Paginador
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

//Overlay
const overlayContent = document.getElementById("overlayContent");

let currentPage;
let nextPage;
let prevPage;
let lastUrl = "";
let totalPages;

getMovies(API_URL);

//Filtrador de generos
let selectedGenre = [];
setGenre();
function setGenre() {
  tags.innerHTML = "";

  genres.forEach((genre) => {
    const div = document.createElement("button");
    div.classList.add("tag");
    div.id = genre.id;
    div.innerText = genre.name;
    div.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            } 
          });
        } else {selectedGenre.push(genre.id);}
        
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
    title.innerHTML = "Most popular movies";
  });

  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const selectedGenre = document.getElementById(id);
      selectedGenre.classList.add("selected");
      title.innerHTML = "";
    });
  }
}

//Mostrar y ocultar categorias
genreShow.addEventListener('click', () => {

  if (tags.style.display = 'none') {
    tags.style.display = 'flex'
    genreShow.style.display = 'none'
    genreHide.style.display = 'flex'
  }
})

genreHide.addEventListener('click', () => {

  if (tags.style.display = 'flex') {
    tags.style.display = 'none'
    genreShow.style.display = 'flex'
    genreHide.style.display = 'none'
  }
})

//Fetch
function getMovies(url) {
  lastUrl = url;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      currentPage = data.page;

      current.innerHTML = currentPage;

      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;

      if (data.total_results === 0) {
        main.innerHTML = "No results..."
      } else {
        showMovies(data.results);
      }


      if (currentPage <= 1) {
        prev.classList.add("disabled");
        next.classList.remove("remove");
      } else {
        prev.classList.remove("disabled");
        next.classList.remove("remove");
      }

      tags.scrollIntoView({ behavior: "smooth" });
    })
    .catch((err) => console.error(err));
}

//Funcion para renderizar html
const showMovies = (data) => {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, backdrop_path, vote_average, overview, poster_path, id } =
      movie;
    const movieRender = document.createElement("div");
    movieRender.classList.add("movie");
    movieRender.innerHTML = `
        <img src="${poster_path ? IMG_SRC + backdrop_path : title}"
                alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
            <h3>Overview</h3>
                ${overview}
                <button class="knowMore" id="${id}">Know more</button>
            </div>
        `;

    main.appendChild(movieRender);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openOverlay(movie);
    });
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

  if (selectedGenre.length != 0) {
    selectedGenre.classList.remove("selected");
  }

  if (title) {
    title.innerHTML = `Results of "${search.value}"...`;
  }

  const searchTerm = search.value;

  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  }
  main.innerHTML = `No results for "${search.value}"`;
});

//Logica paginador
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

//Funcion para llamados a la API segun la pagina
function pageCall(page) {
  //Modificacion de la URL

  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");

  let key = queryParams[queryParams.length - 1].split("=");

  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();

    let nextKey = key.join("=");
    queryParams[queryParams.length - 1] = nextKey;

    let nextQuery = queryParams.join("&");
    let url = urlSplit[0] + "?" + nextQuery;
    getMovies(url);
  }
}

//Overlay
function openOverlay(movie) {
  let MOVIE_ID = movie.id;

  //Fetch y forEach para renderizar Overlay
  fetch(BASE_URL + "/movie/" + MOVIE_ID + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("overlay").style.width = "100%";
        if (videoData.results) {
          let videoEmbed = [];
          videoData.results.forEach((video) => {
            //El endpoint de name esta obsoleto en la API
            console.log("El endpoint de name esta obsoleto en la API");
            let { name, key } = video;
            //Pusheamos al array de los embed el codigo embed de Youtube
            videoEmbed.push(`
            <iframe 
            width="50%"
            height="315"
            src="https://www.youtube.com/embed/${key}"
            title="${name}"
            frameborder="0"
            allow="accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture"
            allowfullscreen>
            </iframe>
            `);
          });
          overlayContent.innerHTML = videoEmbed.toString();
        }
        console.log(overlayContent.innerHTML);
      }
    });
}

//Estilo para cerrar el overlay
function closeNav() {
  document.getElementById("overlay").style.width = "0%";
  //Codigo encontrado para pausar el trailer
  const iframes = document.getElementsByTagName('iframe');
    if (iframes !== null) {
      for (let i = 0; i < iframes.length; i++) {
        iframes[i].src = iframes[i].src; //causes a reload so it stops playing, music, video, etc.
      }
    }
}
