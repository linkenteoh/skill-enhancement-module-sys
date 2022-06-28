const router = require('express').Router();
const ObjectID = require('mongodb').ObjectID
let Result = require('../models/result.model');

router.route('/').get((req, res) => {
    Result.find()
      .then(courses => res.json(courses))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
router.route('/add').post((req, res) => {
    const course = req.body.course;
    const paper = req.body.paper;
    const user = req.body.user;
    const score = req.body.score;
    const status = req.body.status;
    const registration = req.body.registration;

    const newResult = new Result({
        course,
        paper,
        user,
        score,
        status,
        registration
    });
    
    newResult.save(function(err, obj){
        if(err) res.status(400).json('Error' + err)
        res.json(obj)
    }) 
});

router.route('/update/:id').post((req, res) => {
    Result.findById(req.params.id)
        .then(result => {
            result.score = req.body.score;
            result.status = req.body.status;

            result.save(function(err, obj){
                if(err) res.status(400).json('Error' + err)
                res.json(obj)
            }) 
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Result.findByIdAndDelete(req.params.id)
        .then(() => res.json('Course deleted.'))
        .catch(err => res.status(400).send(err));
});

router.route('/student').post((req, res) => {
    Result.find({user: req.body.user, course: req.body.course})
    .populate('paper')
    .then((results) => res.json(results))
    .catch(err => res.status(400).json('Error' + err))
})

router.route('/certStatus/:id').get((req, res) => {
    Result.aggregate([
        {
            $match: {
                user: new ObjectID(req.params.id),
                
            }
        },
        {
            $lookup:{
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courses"
            }
        },
        {
            $unwind:"$courses"
        },
        {
            $group: {
                // _id:"$courses.courseTitle"
                _id:{
                    "title": "$courses.courseTitle",
                    "status": "$status",
                }
            }
        },
        {
            $group: {
                _id: "$_id.title",
                statuses :{$push: "$_id.status"}
            }
        }
    ]).exec(function(err, list){
        var newList = []

        list.forEach(c => {
            if(c.statuses.includes(false)){
                //Do nithing
            }else{
                newList.push(c._id)
            }
        })
        res.send(newList)
    })
})

module.exports = router;