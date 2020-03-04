const express = require('express')
const nunjucks = require('nunjucks')
const app = express()

nunjucks.configure('views', {
    express: app
})

app.use(express.static('build'))

// Set views engine
app.set('view engine', 'html')

// app.get('/posts', function (req, res) {
//     res.render('posts.html')
//   })

// app.use((req, res, next) => {
//     res.render('index.html')
// })

function renderPath (path, res, next) {
    // Try to render the path
    res.render(path, function (error, html) {
        if (!error) {
            // Success - send the response
            res.set({ 'Content-type': 'text/html; charset=utf-8' })
            res.end(html)
            return
        }
        if (!error.message.startsWith('template not found')) {
            // We got an error other than template not found - call next with the error
            next(error)
            return
        }
        if (!path.endsWith('/index')) {
            // Maybe it's a folder - try to render [path]/index.html
            renderPath(path + '/index', res, next)
            return
        }
        // We got template not found both times - call next to trigger the 404 page
        next();
    })
}

matchRoutes = function (req, res, next) {
    var path = req.path

    // Remove the first slash, render won't work with it
    path = path.substr(1)

    // If it's blank, render the root index
    if (path === '') {
    path = 'index'
    }

    renderPath(path, res, next)
}

app.get(/^([^.]+)$/, function (req, res, next) {
    matchRoutes(req, res, next)
})

app.get("*", function(req, res){
    res.status(404)
    res.render('404.html')
})

app.listen(3001)