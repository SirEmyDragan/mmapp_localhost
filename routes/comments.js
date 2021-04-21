const express = require('express');
const router = express.Router({ mergeParams: true });

const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync'); //catchAsync() instead of try {} catch(e){next(e)} to catch the async errors from async function
const { isLoggedIn, isCommentAuthor, validateComment } = require('../middleware.js'); //requiring middleware

const Project = require('../models/project');
const Comment = require('../models/comment');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;