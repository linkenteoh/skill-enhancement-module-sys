const router = require('express').Router();
let Announcement = require('../models/announcement.model');

router.route('/').get((req, res) => {
    Announcement.find()
      .then(ann => res.json(ann))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
const title = req.body.title
const date = Date.parse(req.body.date)
const message = req.body.message
const sender = req.body.sender

const newAnnouncement = new Announcement({
    title,
    message,
    date,
    sender
});

newAnnouncement.save()
.then((results) => res.json(results))
.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Announcement.findById(req.params.id)
    .then(ann => res.json(ann))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Announcement.findByIdAndDelete(req.params.id)
    .then(() => res.json('Announcement deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Announcement.findById(req.params.id)
    .then(ann => {
        ann.title = req.body.title
        ann.message = req.body.message
        ann.sender = req.body.sender
        ann.date = Date.parse(req.body.date)

        ann.save()
        .then(() => res.json('Announcement updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;