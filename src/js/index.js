import SimpleLightbox from 'simplelightbox';

const PIXA_URL = 'https://pixabay.com/';
const searchArea = document.querySelector('.search-form');
const galleryHTML = document.querySelector('.gallery');
const searchMoreButton = document.querySelector('.search-more');

let pageNumber = null;

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
  console.log(searchMoreButton.classList);
  pageNumber = 1;
  search();
}

searchMoreButton.addEventListener('click', searchMore);

var lightbox;

async function searchMore() {
  searchMoreButton.disable = true;
  pageNumber += 1;
  await search();
}

async function search() {
  const responce = await fetch(
    `${PIXA_URL}api/?${options}&q=${searchArea[0].value}&page=${pageNumber}&per_page=40`
  );
  // console.log(responce);
  const pictures = await responce.json();
  console.log(pictures.hits);
  if (pictures.hits.length === 0) {
    ClearSearch();
    return;
  }
  let galleryBLock = '';
  for (let i = 0; i < pictures.hits.length; i++) {
    const picture = `<div class='gallery__item'><a class="gallery__link" href="${pictures.hits[i].largeImageURL}">
                <img class="gallery__image" src="${pictures.hits[i].webformatURL}" data-source="${pictures.hits[i].largeImageURL}" alt="${pictures.hits[i].tags}">
            </a></div>`;
    galleryBLock += picture;
  }
  if (pictures.hits.length === 40) {
    searchMoreButton.disable = false;
    searchMoreButton.classList.remove('is-hidden');
  } else {
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
