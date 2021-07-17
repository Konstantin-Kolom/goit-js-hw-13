import { fetchCollection } from './fetchCollection.js'
import { refs } from './refs.js'

import collectionCardTpl from '../templates/collection.hbs'
import Notiflix from "notiflix";

export let formSearch = ''
export let pageNamber = 1

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

// Поиск по заначению из инпута
export function onSearch(e) {
   e.preventDefault();
   pageNamber = 1
   formSearch = e.currentTarget.elements.searchQuery.value;
      if (formSearch === "") {
      clearsMarkup()
   } else {
      dataСall()
   }

};

// Кнопка загрузить еще...
function onLoadMore() {
   pageNamber += 1;
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

//Разметка и рендез колелкции  
function renderCollection(hits) {
   const markup = collectionCardTpl(hits);
   refs.gallery.innerHTML = markup;
};

// очистка списка
function clearsMarkup() {
   refs.gallery.innerHTML = "";
}

