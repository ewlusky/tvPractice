const $ = require('jquery');
const AJ = require('./ajax.js');
function sizeAdjust(id) {

    let $quote = $(`#${id}.tvtitle`);
    // console.log('size', id, $(`#${id} .tvtitle`));

    let $numWords = $quote.text().split(" ").length;

    if (($numWords >= 1) && ($numWords < 10)) {
        $quote.css("font-size", "36px");
    }
    else if (($numWords >= 10) && ($numWords < 20)) {
        $quote.css("font-size", "32px");
    }
    else if (($numWords >= 20) && ($numWords < 30)) {
        $quote.css("font-size", "28px");
    }
    else if (($numWords >= 30) && ($numWords < 40)) {
        $quote.css("font-size", "24px");
    }
    else {
        $quote.css("font-size", "20px");
    }

};

class showBuilder {

    buildShows() {
        const showDiv = $('.panels');
        const watchedDiv = $('#watched');
        const delDiv = $('#delete-me');
        watchedDiv.empty();
        showDiv.empty();
        delDiv.empty();
        AJ.getField('movies')
            .then(movies => {
                movies.forEach(movie => {
                    showDiv.append(`
                        <div class="panel" id=${movie.id}>
                            <p class="plot" contenteditable>${movie.plot}</p>
                            <p class="tvtitle edit-me" data-image = ${movie.image} data-watched = ${movie.watched} data-id = ${movie.id} contenteditable>${movie.title}</p>
                            <p class="seas" contenteditable>${movie.seasons} Seasons</p>
                        </div>

                    `)
                    if (movie.watched == "false") {
                        watchedDiv.append(`
                        <div class="btn panel" id="btn${movie.id}">
                        <button class="watch-btn" id=${movie.id}>Watched</button>
                        </div>
                    `)
                    } else {
                        watchedDiv.append(`
                        <div class="btn panel" id="btn${movie.id}">
                        <span>Finished</span>
                        </div>
                    `)
                    }
                    delDiv.append(`
                    <div class="btn panel" id="btn${movie.id}">
                    <button class="del-btn" id=${movie.id}>Delete</button>
                    </div>
                    `)
                    $(`#${movie.id}`).css('background-image', `url("${movie.image}")`);
                    sizeAdjust(movie.id);


                });
                $('.watch-btn').on('click', (e) => {
                    const movieId = e.target.id;
                    console.log(e.target.id);
                    e.stopPropagation();
                    console.log(`movies/${movieId}`)
                    AJ.getField(`movies/${movieId}`)
                        .then(movie => {
                            AJ.putMovie(movie.title, movie.plot, movie.seasons, "true", movieId)
                                .then(this.buildShows());
                        })

                    console.log('watch btn', e);
                });
                $('.del-btn').on('click', (e) => {
                    const movieId = e.target.id;
                    e.stopPropagation();
                    AJ.delMovie(movieId);
                });
                const panels = document.querySelectorAll('.panel');

                function toggleOpen() {
                    this.classList.toggle('open');
                    const watchBut = $(`#btn${this.id}`)
                    // console.log(watchBut);
                    watchBut[0].classList.toggle('open');
                }

                function toggleActive(e) {
                    if (e.propertyName.includes('flex')) {
                        this.classList.toggle('open-active');
                    }
                }

                panels.forEach(panel => panel.addEventListener('click', toggleOpen));
                panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));
                console.log($('.edit-me'))

                $('.edit-me').on('keypress', (e) => {
                    const title = e.currentTarget.innerText
                    const seasons = (e.currentTarget.nextElementSibling.innerText).split(" ")[0]
                    const plot = e.currentTarget.previousElementSibling.innerText
                    console.log(e);
                    if (e.which == 13) {
                        AJ.putMovie(title, seasons, plot, e.target.dataset.image, e.target.dataset.watched, e.target.dataset.id)
                            .then(() => {
                                this.buildShows();
                            })
                    }
                })
            })

    }
}
const Builder = new showBuilder;
Builder.buildShows();

const addPage = $('#add');
const addBtn = $('#tv-add-btn');
const subBtn = $('#submit');
addPage.hide();

function showAdd(e) {
    addPage.show(300);
    const logbut = $('#login-submit')
    subBtn.on('click', () => {
        const title = $('#add-title').val();
        const plot = $('#add-plot').val();
        const seasons = $('#add-seasons').val();
        AJ.postMovie(title, plot, seasons)
            .then(() => {
                addPage.hide();
                Builder.buildShows();
            });
    });
}

addBtn.on('click', showAdd);

const modal01 = document.getElementById('add');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal01) {
        addPage.hide();
    }
}


function valueUpdated(e) {
    const range = $('#add-seasons').val();
    $('#range-txt').html(range);
}

$('#add-seasons').on('input', valueUpdated);



