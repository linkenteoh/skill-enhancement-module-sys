const router = require('express').Router();
const ObjectID = require('mongodb').ObjectID
let Registration = require('../models/registration.model');

router.route('/').get((req, res) => {
    Registration.find()
      .populate('user')
      .then(courses => res.json(courses))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
router.route('/add').post((req, res) => {
const course = req.body.course;
const user = req.body.user;
const date = new Date();

const newRegistration = new Registration({
    course,
    user,
    date,
});

newRegistration.save()
.then((results) => res.json(results))
.catch(err => {res.status(400).json('Error: ' + err)});

});

router.route('/checkRegistered').post((req, res) => {

    Registration.find({ user: req.body.user, course: req.body.course})
    .then((registrations) => res.json(registrations))
    .catch(err => res.status(400).send(err));
})

router.route('/enrolled/:id').get((req, res) => {
    Registration.find({ user: req.params.id})
        .populate('course')
        .exec(function(err, registration) {
            var registrations = [];
            
            registration.map((r) => {
                var course = {...r.course._doc}
                course.registeredAt = r.date
                registrations.push(course)
            })
            res.json(registrations);
        })
})

router.route('/registeredStudents/:id').get((req, res) => {
    Registration.find({ course: req.params.id})
    .populate('user')
    .exec(function(err, student) {
        
        var students = [];
        student.map((s) => {
            var student = {...s.user._doc}
            student.registeredAt = s.date
            student.regId = s._id
            students.push(student)
        })
        res.send(students);
    })
});

router.route('/gradingList/:id').post((req, res) => {
    Registration.aggregate([
        {
            $lookup:{
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "users"
            }
        },
        {
            $lookup:{
                from: "results",
                let: { user: "$user" },
                pipeline:[{
                    $match:{
                        $expr: { $eq: ["$$user", "$user"] },
                        paper: new ObjectID(req.body.assessmentId),
                        // user: "$$user"
                    }
                }],
                as: "threshold"
            }
        },
        {
            $match:{
                course: new ObjectID(req.params.id)
            }
        },
    ])
    .exec(function(err, list){
        res.send(list)
    })
});

router.route('/:id').delete((req, res) => {
Registration.findByIdAndDelete(req.params.id)
    .then(() => res.json('Course deleted.'))
    .catch(err => res.status(400).send(err));
});

module.exports = router;