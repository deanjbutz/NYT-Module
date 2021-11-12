const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = 'pJYNhv7aONncGqodsifvyLk9VIOgTGls';
let url;

const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');
const section = document.querySelector('section');

nav.style.display = 'none';

let pageNumber = 0;

searchForm.addEventListener('submit', fetchResults); 
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function fetchResults(e) {
    e.preventDefault();
    url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`;

    if(startDate.value !== '') {
        console.log(startDate.value);
        url += '&begin_date=' + startDate.value;
        console.log('URL: ', url);
    };

    if(endDate.value !== '') {
        url += '&end_date=' + endDate.value;
        console.log('URL: ', url);
    };

    fetch(url)
    .then(function(result) {
        return result.json();
    })
    .then(function(json) {
        displayResults(json);
    })
}

function displayResults(json) {

    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }

    let articles = json.response.docs;

    if(articles.length === 0) {
        console.log("No results");
    } else {
        for(let i = 0; i < articles.length; i++) {
            let article = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');
            let para = document.createElement('p');

            let current = articles[i];

            link.href = current.web_url;
            link.textContent = current.headline.main;
            para.textContent = 'Keywords: ';

            for(let j = 0; j < current.keywords.length; j++) {
                let span = document.createElement('span');
                span.textContent += current.keywords[j].value + ' ';
                para.appendChild(span);
            }

            if (current.multimedia.length > 0) {
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;
            }

            heading.appendChild(link);
            article.appendChild(heading);
            article.appendChild(img);
            article.appendChild(para);
            section.appendChild(article);
        }
    }

    if(articles.length === 10) {
        nav.style.display = 'block';
        if (pageNumber === 0) {
            previousBtn.style.display = 'none';
        } else {
            previousBtn.style.display = 'block'
        }
    } else if (articles.length < 10 && pageNumber !== 0) {
        nav.style.display = 'block';
        nextBtn.style.display = 'none';
    } else {
        nav.style.display = 'none';
    }
};

function nextPage(e) {
    pageNumber++;
    fetchResults(e);
    console.log("Page number: ", pageNumber);
};

function previousPage(e) {
    if(pageNumber > 0) {
        pageNumber--;
    } else {
        return;
    }
    fetchResults(e);
    console.log('Page: ', pageNumber);
};