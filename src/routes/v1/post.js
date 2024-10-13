const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../../controllers/postController');
const auth = require('../../middleware/authMiddleware');

router.post('/create-post', auth, createPost);
router.get('/all-posts', getAllPosts);
router.get('/get-post/:id', getPostById);
router.put('/update-post/:id', auth, updatePost);
router.delete('/delete-post/:id', auth, deletePost);

module.exports = router;
