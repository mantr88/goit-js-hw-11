import axios from 'axios';

const KEY = '34533361-52f77fc65512da5c1ec10b6c5';

axios.defaults.baseURL = 'https://pixabay.com/api';

export const apiFetch = (query, page, HITS_PER_PAGE) => {
    const response = axios.get(`/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${HITS_PER_PAGE}`);
    return response;
    };