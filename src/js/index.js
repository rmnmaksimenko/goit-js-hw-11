import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

const PIXA_URL = 'https://pixabay.com/';
const searchArea = document.querySelector('.search-form');
const galleryHTML = document.querySelector('.gallery');
const searchMoreButton = document.querySelector('.search-more');

let pageNumber = null;
let currentSearchValue = '';

searchArea.addEventListener('click', startSearch);

searchMoreButton.classList.add('is-hidden');

const options =
  'key=27863078-b4a956cfdf1b52b765bed6289&image_type=photo&orientation=horizontal&safesearch=true';

async function startSearch(e) {
  e.preventDefault();
  ClearSearch();
  if (!searchArea[0].value) {
    return;
  }
  // console.log(options);
  currentSearchValue = searchArea[0].value;
  console.log(searchMoreButton.classList);
  pageNumber = 1;
  search();
}

searchMoreButton.addEventListener('click', searchMore);

var lightbox;

async function searchMore() {
  searchMoreButton.disabled = true;
  pageNumber += 1;
  await search();
}

async function search() {
  const responce = await fetch(
    `${PIXA_URL}api/?${options}&q=${currentSearchValue}&page=${pageNumber}&per_page=40`
  );
  console.log(responce);
  const pictures = await responce.json();
  console.log(pictures);
  if (pictures.hits.length === 0) {
    ClearSearch();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (pageNumber === 1) {
    Notiflix.Notify.success(`We found ${pictures.totalHits} pictrues!`);
  }
  let galleryBLock = '';
  for (let i = 0; i < pictures.hits.length; i++) {
    const picture = `<div class='gallery__item'><a class="gallery__link" href="${pictures.hits[i].largeImageURL}">
                <img class="gallery__image" src="${pictures.hits[i].webformatURL}" data-source="${pictures.hits[i].largeImageURL}" alt="${pictures.hits[i].tags}">
            <div class='gallery__box'>
            <ul>
            <li><h2 class='gallery-header'>Likes</h2><p class='gallery-text'>${pictures.hits[i].likes}</p></li>
            <li><h2 class='gallery-header'>Views</h2><p class='gallery-text'>${pictures.hits[i].views}</p></li>
            <li><h2 class='gallery-header'>Comments</h2><p class='gallery-text'>${pictures.hits[i].comments}</p></li>
            <li><h2 class='gallery-header'>Downloads</h2><p class='gallery-text'>${pictures.hits[i].downloads}</p></li>
            </ul>
            </div></a>
            </div>`;
    galleryBLock += picture;
  }
  if ((pictures.hits.length === 40) & (pageNumber * 40 < pictures.totalHits)) {
    searchMoreButton.disabled = false;
    searchMoreButton.classList.remove('is-hidden');
  } else {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    searchMoreButton.classList.add('is-hidden');
  }
  galleryHTML.insertAdjacentHTML('beforeend', galleryBLock);
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function ClearSearch() {
  galleryHTML.innerHTML = '';
  searchMoreButton.classList.add('is-hidden');
}
