const router = require('express').Router();
let Class= require('../models/class.model');

router.route('/add').post((req, res) => {
const title = req.body.title;
const venue = req.body.venue;
const link = req.body.link;
const lecturer = req.body.lecturer;
const startTime = req.body.startTime;
const endTime = req.body.endTime;
const course = req.body.course;

var date = null;
if(req.body.date){
    date = Date.parse(req.body.date);
}

const newClass = new Class({
    title,
    venue,
    link,
    lecturer,
    startTime,
    endTime,
    date,
    course,
});

newClass.save()
.then((results) => res.json(results))
.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
Class.find({course : req.params.id})
    .populate('Course')
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
Class.findByIdAndDelete(req.params.id)
    .then(() => res.json('Paper deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
Class.findById(req.params.id)
    .then(c => {

    var date = null;
    if(req.body.date){
        date = Date.parse(req.body.date)
    }

    c.title = req.body.title;
    c.venue = req.body.venue;
    c.lecturer = req.body.lecturer;
    c.startTime = req.body.startTime;
    c.endTime = req.body.endTime;
    c.link = req.body.link;
    c.date = date; 

    c.save()
        .then(() => res.json('Class updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;