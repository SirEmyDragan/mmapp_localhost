const express = require('express');
const router = express.Router();

const projects = require('../controllers/projects');
const catchAsync = require('../utils/catchAsync'); //catchAsync() instead of try {} catch(e){next(e)} to catch the async errors from async function
const { isLoggedIn, validateProject, isAuthor } = require('../middleware.js'); //requiring middleware

const multer = require('multer'); //requiring multer for image uploads
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Project = require('../models/project');

router.route('/')
    .get(catchAsync(projects.index))
    .post(isLoggedIn, upload.array('image'), validateProject, catchAsync(projects.createProject))

router.get('/new', isLoggedIn, projects.renderNewForm)

router.route('/:id')
    .get(catchAsync(projects.showProject))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProject, catchAsync(projects.updateProject))
    .delete(isLoggedIn, isAuthor, catchAsync(projects.deleteProject));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(projects.renderEditForm));

module.exports = router;