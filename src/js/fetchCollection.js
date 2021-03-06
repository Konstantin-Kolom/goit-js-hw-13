import { API_KEY } from './key.js'
import { formSearch, pageNamber, quantityPerPage } from './them.js'
// import { pageNamber } from './them.js'
// import { quantityPerPage } from './them.js'

const url = 'https://pixabay.com/api/'

export function fetchCollection() {
   return fetch(`${url}?&key=${API_KEY}&q=${formSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${quantityPerPage}&page=${pageNamber}`)
      .then(response => {
         if (!response.ok) {
             throw new Error(response.status);
         }
         // console.log(response);
         return response.json();
      })
};