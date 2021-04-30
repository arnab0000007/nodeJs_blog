const router = require('express').Router()
const {
    isAuthenticated
} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    postsGetController
} = require('../controllers/postController')
const postValidator = require('../validator/dashboard/post/postValidator')
router.get('/create', isAuthenticated, createPostGetController)
router.post('/create', isAuthenticated, upload.single('post-thumbnail'),postValidator, createPostPostController)
router.get('/edit/:postId',isAuthenticated,editPostGetController)
router.post('/edit/:postId',isAuthenticated,upload.single('post-thumbnail'),postValidator,editPostPostController)
router.get('/delete/:postId',isAuthenticated,deletePostGetController)
router.get('/',isAuthenticated,postsGetController)

module.exports = router