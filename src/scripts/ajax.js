const $ = require('jquery');

class ajaxCalls {
    getField(resource) {
        return $.ajax(`http://localhost:3000/${resource}`)
    }

    postMovie(title, plot, seasons) {
        return $.ajax({
            url: "http://localhost:3000/movies",
            method: "POST",
            data: {
                "title": title,
                "plot": plot,
                "seasons": seasons,
                "image" : "https://s3-ap-southeast-1.amazonaws.com/popcornsg/placeholder-movieimage.png",
                "watched": false
            }
        })
    }

    putMovie(title, plot, seasons, image, watched, id) {
        return $.ajax({
            url: `http://localhost:3000/movies/${id}`,
            method: "PUT",
            data: {
                "title": title,
                "plot": plot,
                "seasons": seasons,
                "image" : image,
                "watched": watched

            }
        })
    }

    delMovie(id) {
        return $.ajax({
            url: `http://localhost:3000/movies/${id}`,
            method: "DELETE"
        })
    }
}

const ajax = new ajaxCalls;

module.exports = ajax;