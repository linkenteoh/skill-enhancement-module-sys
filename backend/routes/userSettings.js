const router = require('express').Router();

const Programme = require('../models/programme.model');
const Session = require('../models/session.model');

router.route('/getSessions').get((req, res) => {
    Session.find({})
    .then(sessions => res.send(sessions))
    .catch(err => res.status(400).json('Err' + err))
});

router.route('/getProgrammes').get((req, res) => {
    Programme.find({})
    .then(programmes => res.send(programmes))
    .catch(err => res.status(400).json('Err' + err))
});

router.route('/addSession').post((req, res) => {
    const session = req.body.session
    const newSession = new Session({
        session
    })

    newSession.save()
    .then(session => res.json(session))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addProgramme').post((req, res) => {
    const programme = req.body.programme
    const newProgramme = new Programme({
        programme
    })

    newProgramme.save()
    .then(programme => res.json(programme))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;