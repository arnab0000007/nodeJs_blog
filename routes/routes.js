const authRoute = require('./authRoute')
const dashboardRoute = require('./dashboardRoute')
const playgroundRoute = require('../playground/play')
const uploadRoute = require('./uploadRoutes')
const postRoute = require('./postRoute')
const apiRoutes = require('../api/routes/apiRoutes')
const explorerRoute = require('./explorerRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')
const routes = [{
        path: '/auth',
        controller: authRoute
    },
    {
        path: '/dashboard',
        controller: dashboardRoute
    },
    {
        path: '/uploads',
        controller: uploadRoute
    },
    {
        path: '/posts',
        controller: postRoute
    },
    {
        path: '/api',
        controller: apiRoutes
    },
    {
        path: '/explorer',
        controller: explorerRoute
    },
    {
        path: '/search',
        controller: searchRoute
    },
    {
        path:'/author',
        controller:authorRoute
    },
    {
        path: '/playground',
        controller: playgroundRoute
    },
    {
        path: '/',
        controller: (req, res) => {

            res.redirect('explorer')
        }
    }
]
module.exports = app => {
    routes.forEach(r => {
        if (r.path == '/') {
            app.get(r.path, r.controller)
        } else {
            app.use(r.path, r.controller)
        }
    })
}