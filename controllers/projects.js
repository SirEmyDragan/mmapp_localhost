const Project = require('../models/project');
const ObjectID = require('mongodb').ObjectID;
const { cloudinary } = require("../cloudinary");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const projects = await Project.find({});
    res.render('projects/index', { projects })
}

module.exports.renderNewForm = (req, res) => {
    res.render('projects/new');
}

module.exports.createProject = async (req, res, next) => {
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    const project = new Project(req.body.project);
    // campground.geometry = geoData.body.features[0].geometry;
    project.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    project.author = req.user._id;
    await project.save();
    console.log(project);
    req.flash('success', 'Successfully made a new project!');
    res.redirect(`/projects/${project._id}`)
}

module.exports.showProject = async (req, res,) => {
    if (!ObjectID.isValid(req.params.id)) {
        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid project show id, returnTo reset to:', req.session.returnTo);
    }
    const project = await Project.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/projects');
    }
    res.render('projects/show', { project });
}

module.exports.renderEditForm = async (req, res) => { //editProject
    const { id } = req.params;
    const project = await Project.findById(id)
    if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/projects');
    }
    res.render('projects/edit', { project });
}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    // const geoData = await geocoder
    //   .forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1,
    //   })
    //   .send();
    const project = await Project.findByIdAndUpdate(id, {
      ...req.body.project,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    project.images.push(...imgs);
    // project.geometry = geoData.body.features[0].geometry;
    await project.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await project.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    console.log(project);
    req.flash("success", "Successfully updated a project!");
    res.redirect(`/projects/${project._id}`);
  };

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted project!')
    res.redirect('/campgrounds');
}