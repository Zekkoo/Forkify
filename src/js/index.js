// Global app controller

import Search from './models/Search';

const search = new Search('brownies');
console.log('hello');
console.log(search);
search.getResults();