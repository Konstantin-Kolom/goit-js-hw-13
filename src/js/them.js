import { fetchCollection } from './fetchCollection.js'
import { refs } from './refs.js'
import collectionCardTpl from '../templates/collection.hbs'
import Notiflix from "notiflix";

export let formSearch = ''
export let pageNamber = 1
export let quantityPerPage = 40

let totalPerPage = 0;
const DEBOUNCE_DELAY = 300;

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);


//////////////// Поиск по заначению из инпута
export function onSearch(e) {
   e.preventDefault();
   pageNamber = 1
   totalPerPage = 0
   formSearch = e.currentTarget.elements.searchQuery.value;
   if (formSearch === "") {
      clearsMarkup()
      noSearchQuery(Notiflix)
      // return
   } else {
      dataСall()
   }
};

//////////////// Очистка списка
function clearsMarkup() {
   refs.btnLoadMore.classList.add('js_hidden')
   refs.gallery.innerHTML = '';
}
  

//////////////// Кнопка "загрузить еще" - нажатие...
function onLoadMore() {
   pageNamber += 1;
   refs.btnLoadMore.classList.add('js_hidden')
   dataСall();
};

// / Вызов данных
function dataСall() {
   fetchCollection()
      .then(renderCollection)
      .catch(error => {
         console.log(error);
         // erorrSearchCountry(Notiflix)
      })
};


//////////////// Разметка и рендеp колелкции  
function renderCollection(picture) {
   const collectionObject = picture.hits;
   const collectionLength = Object.keys(collectionObject).length;
   const totalPicture = picture.totalHits
   totalPerPage += collectionLength;

   setTimeout(() => {
      if (collectionLength === 0 && totalPicture === 0) {
         clearsMarkup()
         noSearchQuery(Notiflix)
         return
      }
      if (collectionLength !== 0 && pageNamber === 1) {
         // loadNatiflix(Notiflix)
         Notiflix.Notify.success(`Hooray! We found ${totalPicture} images.`)
      }
      if (collectionLength > 0 && pageNamber === 1)  {
         const markup = collectionCardTpl(picture);
         refs.gallery.innerHTML = markup;
         buttonVisible();
      }
      if (collectionLength > 0 && pageNamber > 1)  {
         const markup = collectionCardTpl(picture);
         refs.gallery.insertAdjacentHTML('beforeend', markup)
         buttonVisible();
      }
      if (totalPerPage === totalPicture) {
         refs.btnLoadMore.classList.add('js_hidden');
         endSearchQuery(Notiflix)
      }
       
   }, DEBOUNCE_DELAY);
};


//////////////// Нотифкации - Notiflix
// Не найдено по запросу - Сообщение
function noSearchQuery() {
   Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

// Количестко найденых картинок
// function AllSearchQuery() {
//    Notiflix.Notify.success(`Hooray! We found ${totalPicture} images.`);
// }

// function endSearchQuery(Notiflix)
// Конец галереи
function endSearchQuery() {
   Notiflix.Notify.info("We're sorry, but (you've) reached the end of search results.");
}

// загрузка 
function loadNatiflix () {
   Notiflix.Loading.circle('Please wait...');
}


//////////////// Кнопка "загрузить еще" -поведение
refs.btnLoadMore.classList.add('js_hidden') // изначально скрывает видимость

function buttonVisible () {
   return refs.btnLoadMore.classList.remove('js_hidden') // возвращяет видимость кнопки
}



