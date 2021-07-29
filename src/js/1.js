// -- ИМПОРТ
import SimpleLightbox from 'simplelightbox';
// import Notiflix from 'notiflix';
// import card from '../hbs/card.hbs';
// import PicturesApiService from './api-service';

// -- ЭЛЕМЕНТЫ
const divEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const formEl = document.querySelector('.search-form');

// -- ЭКЗЕМПЛЯРЫ КЛАССОВ PicturesApiService и SimpleLightbox
const picturesApiService = new PicturesApiService();
const gallery = new SimpleLightbox('.gallery a');

// -- СОБЫТИЯ
formEl.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);

// -- ЗАПРОС ПРИ SUBMIT ФОРМЫ
function onSearch(e) {
  e.preventDefault();
  btnLoadMore.classList.add('is-hidden');

  clearContainer();
  picturesApiService.query = e.currentTarget.elements.query.value.trim();
  if (picturesApiService.query === '') {
    return;
  }
  picturesApiService.resetPage();
  picturesApiService.fetchcImages().then(onRenderPictures).catch(onError);
}

// -- ЗАПРОС ПО КНОПКЕ LOAD MORE
function onLoadMore() {
  picturesApiService.fetchcImages().then(onRenderPictures).catch(onError);
}

// -- РЕНДЕР ИЗОБРАЖЕНИЙ
function onRenderPictures({ totalHits, hits }) {
  if (hits.length === 0) {
    btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  let totalPictures = picturesApiService.quantityPerPage * (picturesApiService.page - 1);

  if (totalPictures > totalHits) {
    btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  divEl.insertAdjacentHTML('beforeend', card(hits));
  gallery.refresh();
  btnLoadMore.classList.remove('is-hidden');
  Notiflix.Notify.success(`Hooray! We found ${totalPictures} images out of ${totalHits}.`);
}

// -- БЛОК ОШИБКИ
function onError() {
  Notiflix.Notify.failure('Oops, pls, try again');
}

// -- ОЧИСТКА КОНТЕЙНЕРА
function clearContainer() {
  divEl.innerHTML = '';
}

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.quantityPerPage = 40;
  }

  fetchcImages() {
    const url = `https://pixabay.com/api/?&key=22641637-7351131587a9af45879174884&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.quantityPerPage}&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then(({ totalHits, hits }) => {
        this.page += 1;

        return { totalHits, hits };
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}