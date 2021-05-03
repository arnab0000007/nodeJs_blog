const {
    validationResult
} = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const Flash = require('../utils/Flash')
const readingTime = require('reading-time')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

exports.createPostGetController =async (req, res, next) => {

    try {

        let profile = await Profile.findOne({
            user: req.user._id
        })
        if(!profile){
            res.redirect('/dashboard/create-profile')
        }
        res.render('pages/dashboard/post/createPost', {
            title: 'create A new Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            value: {}
        })
        
    } catch (e) {
        next(e)
    }

   
}
exports.createPostPostController = async (req, res, next) => {

    let {
        title,
        body,
        tags
    } = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/post/createPost', {
            title: 'create A new Post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags
            }
        })
    }

    if (tags) {
        tags = tags.split(',')
        tags = tags.map(t => t.trim())
    }

    let readTime = readingTime(body).text
    let post = new Post({
        title,
        body,
        author: req.user._id,
        tags,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try {

        let createdPost = await post.save()
        await Profile.findOneAndUpdate({
            user: req.user._id
        }, {
            $push: {
                'posts': createdPost._id
            }
        })
        req.flash('success', 'Post Created Successfully')
        return res.redirect(`/posts/edit/${createdPost._id}`)

    } catch (e) {
        next(e)
    }

}
exports.editPostGetController = async (req, res, next) => {
    let postId = req.params.postId
    try {

        let post = await Post.findOne({
            author: req.user._id,
            _id: postId
        })
        if (!post) {
            let error = new Error('404 Page Not Found')
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/editPost', {
            title: 'Edit your Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            post
        })
    } catch (e) {
        next(e)
    }
}
exports.editPostPostController = async (req, res, next) => {
    let {
        title,
        body,
        tags
    } = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormatter)

    try {

        let post = await Post.findOne({
            author: req.user._id,
            _id: postId
        })

        if (!post) {
            let error = new Error('404 Page Not Found')
            error.status = 404
            throw error
        }

        if (!errors.isEmpty()) {
            return res.render('pages/dashboard/post/createPost', {
                title: 'Update Post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
            })
        }
        if (tags) {
            tags = tags.split(',')
            tags = tags.map(t => t.trim())
        }

        let thumbnail = post.thumbnail
        if (req.file) {
        thumbnail = `/uploads/${req.file.filename}`
        }

        await Post.findOneAndUpdate({
            _id: post._id
        }, {
            $set: {
                title,
                body,
                tags,
                thumbnail
            }
        }, {
            new: true
        })
        req.flash('success', 'post updated Successfully')
        res.redirect('/posts/edit/' + post._id)

    } catch (e) {
        next(e)
    }
}

exports.deletePostGetController = async (req, res, next) => {
    let {
        postId
    } = req.params
    try {

        let post = await Post.findOne({
            author: req.user._id,
            _id: postId
        })
        if (!post) {
            let error = new Error('400 Page Not Found')
            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({
            _id: postId
        })
        await Profile.findOneAndUpdate({
            user: req.user._id
        }, {
            $pull: {
                'posts': post._id
            }
        })

        await Profile.findOneAndUpdate({
            user: req.user._id
        }, {
            $pull: {
                'bookmarks': post._id
            }
        })

        req.flash('success', 'post deleted Successfully')

        res.redirect('/posts')


    } catch (e) {
        next(e)
    }
}
exports.postsGetController = async (req, res, next) => {
    try {
        let posts = await Post.find({
            author: req.user._id
        })
        res.render('pages/dashboard/post/posts', {
            title: 'My Created Posts',
            posts,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        next(e)
    }

}