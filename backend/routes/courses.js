const router = require('express').Router();
let Course = require('../models/course.model');

router.route('/').get((req, res) => {
    Course.find()
      .then(courses => res.json(courses))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/completed').get((req, res) => {
    Course.find({completed: true})
      .then(courses => res.json(courses))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/studentList').get((req, res) => {
    Course.find({published: true, completed: false})
      .then(courses => res.json(courses))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
router.route('/add').post((req, res) => {
const courseTitle = req.body.courseTitle;
const courseOverview = req.body.courseOverview;
const courseObjectives = req.body.courseObjectives;
const startDate = Date.parse(req.body.startDate);
const endDate = Date.parse(req.body.endDate); 
const published = req.body.published;
const completed = false;


const newCourse = new Course({
    courseTitle,
    courseOverview,
    courseObjectives,
    startDate,
    endDate,
    published,
    completed
});

newCourse.save()
.then((results) => res.json(results))
.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
Course.findById(req.params.id)
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getPublished').post((req, res) => {
    Course.find({published:true})
      .then(courses => res.json(courses))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
Course.findByIdAndDelete(req.params.id)
    .then(() => res.json('Course deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
Course.findById(req.params.id)
    .then(course => {
    course.courseTitle = req.body.courseTitle;
    course.courseOverview = req.body.courseOverview;
    course.courseObjectives = req.body.courseObjectives;
    course.startDate = Date.parse(req.body.startDate);
    course.endDate = Date.parse(req.body.endDate); 
    course.published = req.body.published; 

    course.save()
        .then(() => res.json('Course updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/toggleCompleted/:id').post((req, res) => {
    Course.findOneAndUpdate(
        {
            _id: req.params.id
        }, 
        {
            $set:{ completed: !req.body.completed }
        }
    )
    .then(course => res.send('Module completed!'))
    .catch(err => res.status(400).json('Error' + err))
});



module.exports = router;