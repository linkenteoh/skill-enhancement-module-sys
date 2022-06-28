const router = require('express').Router();
let Paper = require('../models/paper.model');

// router.route('/').get((req, res) => {
//     Paper.find()
//       .then(courses => res.json(courses))
//       .catch(err => res.status(400).json('Error: ' + err));
//   });
  

/*
paperName:{ type: String, required:true},
    paperSchedule: {type: Date},
    paperVenue: {type: String},
    paperTime:{type: String},
    course:[
        {type: Schema.Types.ObjectId, ref:'Course'}
    ]
*/

router.route('/add').post((req, res) => {
const paperName = req.body.paperName;
const paperTime = req.body.paperTime;
const venue = req.body.venue;
const venueLink = req.body.venueLink;
// const paperSchedule = Date.parse(req.body.paperSchedule);
const course = req.body.course;
const threshold = req.body.threshold;

var paperSchedule = null;
if(req.body.paperSchedule){
    paperSchedule = Date.parse(req.body.paperSchedule);
}

const newPaper = new Paper({
    paperName,
    course,
    paperTime,
    venue,
    venueLink,
    paperSchedule,
    threshold
});

newPaper.save()
.then((results) => res.json(results))
.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:id').get((req, res) => {
Paper.findById(req.params.id)
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
Paper.find({course : req.params.id})
    .populate('Course')
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getPapers/:id').get((req, res) => {
    Paper.find({course : req.params.id})
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
    });

router.route('/:id').delete((req, res) => {
Paper.findByIdAndDelete(req.params.id)
    .then(() => res.json('Paper deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
Paper.findById(req.params.id)
    .then(paper => {

    var schedule = null;
    if(req.body.paperSchedule){
        schedule = Date.parse(req.body.paperSchedule)
    }
    paper.paperName = req.body.paperName;
    paper.paperTime = req.body.paperTime;
    paper.venue = req.body.venue;
    paper.venueLink = req.body.venueLink;
    paper.paperSchedule = schedule; 
    paper.threshold = req.body.threshold;


    paper.save()
        .then(() => res.json('Paper updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;