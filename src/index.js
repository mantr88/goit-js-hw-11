import { Notify } from 'notiflix/build/notiflix-notify-aio';

const KEY = '34533361-52f77fc65512da5c1ec10b6c5';
const HITS_PER_PAGE = 40;
let page = 1;
let items = [];
let query = '';

const refs = {
    // button: document.addEventListener('button'),
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
};

const showBtnLoadMore = () => {
    refs.loadMore.classList.remove("is-hidden");
};

const render = () => {
    const galleryMarkup = items.map(({ likes, views, comments, downloads, tags, webformatURL }) => `
        <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
        <p class="info-item">
        <b>Likes</b>
        ${likes}
        </p>
        <p class="info-item">
        <b>Views</b>
        ${views}
        </p>
        <p class="info-item">
        <b>Comments</b>
        ${comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>
        ${downloads}
        </p>
    </div>
    </div>
    `);

    if (page === 1) {
        refs.gallery.innerHTML = '';
    };

    refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    showBtnLoadMore();
    if (items.length < HITS_PER_PAGE) {
        refs.loadMore.classList.add("is-hidden");
    }
};

const showBadQueryMsg = () => {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

const queryHandler = (e) => {
    e.preventDefault();
    const { value } = e.target.elements.searchQuery;

    if (query === value || !value) {
        return;
    };

    query = value.trim();

    if (query === '') {
        return;
    };

    page = 1;
    goFetch(query);
};

const goFetch = async (query) => {
    const response = await fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${HITS_PER_PAGE}`);
    const photos = await response.json();
    if (photos.hits.length === 0) {
        showBadQueryMsg();
    };

    if (photos.hits.length < HITS_PER_PAGE) {
        // refs.loadMore.classList.add("is-hidden");
        Notify.info("We're sorry, but you've reached the end of search results.");
    }

    items = photos.hits;
    render();
};

const loadMoreHandler = () => {
    page += 1;
    goFetch(query);
};
// dogs and white cats

refs.form.addEventListener('submit', queryHandler);
refs.loadMore.addEventListener('click', loadMoreHandler);

