
const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; // initialize baseURL endpoint
const key = 'pJYNhv7aONncGqodsifvyLk9VIOgTGls'; // initialize key with API key
let url; // declaring variable of url

const searchTerm = document.querySelector('.search');       // initializing a constant variable to access HTML classes
const startDate = document.querySelector('.start-date');    // initializing a constant variable to access HTML classes
const endDate = document.querySelector('.end-date');        // initializing a constant variable to access HTML classes
const searchForm = document.querySelector('form');          // initializing a constant variable to access HTML form elements
const submitBtn = document.querySelector('.submit');        // initializing a constant variable to access HTML classes
const nextBtn = document.querySelector('.next');            // initializing a constant variable to access HTML classes
const previousBtn = document.querySelector('.prev');        // initializing a constant variable to access HTML classes
const nav = document.querySelector('nav');                  // initializing a constant variable to access HTML nav elements
const section = document.querySelector('section');          // initializing a constant variable to access HTML section elements

nav.style.display = 'none'; // adding property of "display: none;" as a style to nav elements => <nav style="display: none;">
let pageNumber = 0; // declaring and initializing variable pageNumber with a value of 0
// console.log('PageNumber:', pageNumber);

searchForm.addEventListener('submit', fetchResults); // listens for submit on variable searchForm and calls fetchResults
nextBtn.addEventListener('click', nextPage); // listens for click on variable nextBtn and calls nextPage
previousBtn.addEventListener('click', previousPage); // listens for click on variable previousBtn and calls previousPage

function fetchResults(e) { //declaring function of fetchResults with parameter of e (most commonly used as abbreviation for event)
    // console.log(e);
    e.preventDefault(); // prevent event from refreshing the browser

    url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`; // building detailed URL using baseURL, key, pageNumber, and searchTerm.value
    // console.log('URL:', url);

    if (startDate.value !== '') { // checks if startDate is NOT empty
        console.log(startDate.value) // logs startDate.value to console
        url += '&begin_date=' + startDate.value; // re-initializes url to include "&begin_date=" and startDate.value
        console.log('URL:', url); // logs new url to console
    }

    if (endDate.value !== '') { // check if endDate is NOT empty
        console.log(endDate.value) // logs endDate.value to console
        url += '&end_date=' + endDate.value; // re-initializes url to include "&end_date=" and endDate.value
        console.log('URL:', url); // logs new url to console
    }

    fetch(url) // calling function fetch with an argument of url
        .then(function (result) { // promise resolver
            console.log(result) // log result to console
            return result.json(); // returns result in JSON format
        })
        .then(function (json) { // chaining promise resolver
            console.log(json); // log json to console
            displayResults(json); // calling function displayResults with an argument of json
        })             //! ^^^ above json is an argument
}                      
                //!     \/\/ below json is a parameter
function displayResults(json) { // declaring function displayResults with a parameter of json
    console.log('Display Results', json); // log json to console
    // console.log(json.response.docs);

    while (section.firstChild) { // while previous data is there (while section has a firstChild is true)
        section.removeChild(section.firstChild); // remove firstChild until section has firstChild is false
    }

    let articles = json.response.docs; // declaring and initializing articles with a value of json.response.docs
    // console.log(articles);

    if (articles.length === 0) { // if length of array articles is 0 then...
        console.log('No results'); // log No results to console
    } else {
        for (let i = 0; i < articles.length; i++) { // for i=0 to i less than length of array articles, by 1
            // console.log(i);
            let article = document.createElement('article'); // declaring and initializing article with value of create HTML tag of article
            let heading = document.createElement('h2'); // declaring and initializing heading with value of create HTML tag of h2
            let link = document.createElement('a'); // declaring and initializing link with value of create HTML tag of a
            let img = document.createElement('img'); // declaring and initializing img with value of create HTML tag of img
            let para = document.createElement('p'); // declaring and initializing para with value of create HTML tag of p
            // let clearfix = document.createElement('div'); // declaring and initializing clearFix with value of create HTML tag of div
            let current = articles[i]; // declaring and initializing variable of current with a value of articles at the index of i

            console.log('Current:', current); // log current to console

            link.href = current.web_url; // setting the href value of the link tag with the web_url key of current
            link.textContent = current.headline.main; // setting the textContect value of the link tag with the main key of the headline key of current
            para.textContent = 'Keywords: '; // setting the textContent value of the para tag with "Keywords: " => <p>"Keywords: "</p>

            for (let j = 0; j < current.keywords.length; j++) { // for j=0 to j less than length of keywords key array of current, by 1
                let span = document.createElement('span'); // declaring and initializing span with value of create HTML tag of span
                span.textContent += current.keywords[j].value + ' '; // setting the textContent value of span with the index of j keyword key of current + a space
                para.appendChild(span); // append the span HTML tag (with textContent) to the para tag
            }

            if (current.multimedia.length > 0) { // if there are value(s) in multimedia key of current...
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url; // sets HTML img tag src value to https.. + url at index of 0 of multimedia key of current
                img.alt = current.headline.main; // sets HTML img tag alt value to main key of headline key of current
            }

            // clearfix.setAttribute('class', 'clearfix');
            heading.appendChild(link); // append link to heading
            article.appendChild(heading); // append heading to article
            article.appendChild(img); //append img to article
            article.appendChild(para); // append para to article
            // article.appendChild(clearfix);
            section.appendChild(article); // append article to section
        }
    }

    if (articles.length === 10) { // if there are exactly 10 articles
        nav.style.display = 'block'; // show the nav
    } else {                        // else
        nav.style.display = 'none'; // don't show the nav
    }
}

function nextPage(e) { // declare function nextPage with parameter of e
    // console.log('Next button clicked');
    pageNumber++; // increment pageNumber by 1
    fetchResults(e); // calls function fetchResults with an argument of e
    console.log('Page Number:', pageNumber); // log pageNumber to console
}

function previousPage(e) { // declare function previousPage with parameter of e
    // console.log('Previous button clicked');
    if (pageNumber > 0) { // if pageNumber is greater than 0 then...
        pageNumber--; // decrease pageNumber by 1
    } else { // else...
        return; // return nothing
    }

    fetchResults(e); // update url for results
    console.log('Page:', pageNumber); // logs to console
}