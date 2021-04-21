const mongoose = require('mongoose');
const projects = require('./projects');
const { places, descriptors } = require('./seedHelpers');
const Project = require('../models/project');

mongoose.connect('mongodb://localhost:27017/mmapp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Project.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const prj = new Project({
            // Your User ID
            author: '60468b89ccfbbdda182f79cb',
            location: `${projects[random1000].city}, ${projects[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {   
                    url: 'https://res.cloudinary.com/specterdev/image/upload/v1615232569/MMApp/prj1.jpg',
                    filename: 'MMApp/prj1'
                },
                {
                    url: 'https://res.cloudinary.com/specterdev/image/upload/v1615232594/MMApp/prj2.jpg',
                    filename: 'MMApp/prj2'
                },
                {
                    url: 'https://res.cloudinary.com/specterdev/image/upload/v1615232594/MMApp/prj3.jpg',
                    filename: 'MMApp/prj3'
                },
                {
                    url: 'https://res.cloudinary.com/specterdev/image/upload/v1615232594/MMApp/prj4.jpg',
                    filename: 'MMApp/prj4'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!'
        })
        await prj.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})