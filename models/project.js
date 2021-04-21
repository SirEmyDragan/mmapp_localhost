const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/specterdev/image/upload/w_300/v1613485505/YelpCamp/apw0ggxancjnukdwiyzl.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const ProjectSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    status: String,
    // status: ['Proposed', 'Active', 'Frozen', 'Completed', 'Canceled'],
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, opts);

ProjectSchema.virtual('properties.popUpMarkup').get(function () {
    return `
        <strong><a href="/projects/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0, 20)}...</p>`
});

ProjectSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Project', ProjectSchema);