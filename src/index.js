// імпорт бібліотеки Notify
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// імпорт бібліотеки SimpleLightbox
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

import { apiFetch } from './js/api';

const HITS_PER_PAGE = 40;
let page = 1;
let items = [];
let query = '';

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
};

const showBtnLoadMore = () => {
    refs.loadMore.classList.remove("is-hidden");
};

const showBadQueryMsg = () => {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

const showSuccessMsg = (totalHits) => {
    // Після першого запиту з кожним новим пошуком показуємо повідомлення
    if (page === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
    };
};


const render = () => {
    const galleryMarkup = items.map(({ likes, views, comments, downloads, tags, webformatURL, largeImageURL }) => `
    <a href="${largeImageURL}">
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
    </a>
    `);

    // очищаємо сторінку при кожному новому запиті
    if (page === 1) {
        refs.gallery.innerHTML = ''; 
    };

    refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    // оновлюємо сторінку при завантаженні нової сторінки з даними
    simpleLightbox.refresh();
    // показуємо кнопку Load More при новому запиті
    showBtnLoadMore();
    // ховаємо кнопку Load More на останній сторінці з даними
    if (items.length < HITS_PER_PAGE) {
        refs.loadMore.classList.add("is-hidden");
    };
};

// запускаємо бібліотеку SimpleLightbox
let  simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
    captionDelay: 250,
});

const queryHandler = (e) => {
    e.preventDefault();
    // отримуємо строку запита
    const { value } = e.target.elements.searchQuery;
    // якщо запит введено вперше та поле запиту не порожшнє,
    // то записуємо строку запиту в змінну
    if (query === value || !value) {
        return;
    };

    query = value.trim();

    if (query === '') {
        return;
    };
    // для отримання першої сторінки отриманих данних від АРІ    
    page = 1;
    // викликаємо функцію обробки пошуку данних по запиту в АРІ
    searchPhoto(query, page);
};

const searchPhoto = async (query, page) => {
    try {
        // передаємо необхідні аргументи та викликаємо функцію запиту данних по запиту в АРІ
        const response = await apiFetch(query, page, HITS_PER_PAGE);
        // реструктуризація даних для подальшого використання
        const { data } = response;
        // Якщо користувач дійшов до кінця колекції виводемо повідомлення
        if (data.hits.length < HITS_PER_PAGE) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        };
    
        items = data.hits;
        render();
        // Після першого запиту з кожним новим пошуком виводимо повідомлення
        if (page === 1) {    
            showSuccessMsg(data.totalHits);
        };

         // виводимо сповіщення нічого підходящого не було знайдено
        if (data.hits.length === 0) {
            showBadQueryMsg();
        }; 
    } catch (error) {
        console.log(error);
    };
   
};

const loadMoreHandler = () => {
    page += 1;
    searchPhoto(query, page);
    
};

refs.form.addEventListener('submit', queryHandler);
refs.loadMore.addEventListener('click', loadMoreHandler);

