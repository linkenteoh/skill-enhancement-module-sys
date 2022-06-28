const router = require('express').Router();
const pdfTemplate = require('../utils/certificate');
const pdf = require('html-pdf')
const sendEmail = require('../utils/sendEmail');
const QRCode = require('qrcode');

const User = require('../models/user.model');
const Certificate = require('../models/certificate.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
  .then(() => res.json('User deleted.'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
      .then(user => {
        user.verified = true
        user.name = req.body.name
        user.email = req.body.email
    // user.password = req.body.password
        user.programme = req.body.programme
        user.studentId = req.body.studentId
        user.session = req.body.session
        user.role = req.body.role
        user.icNo = req.body.icNo
        user.studId = req.body.studId
        user.verified = true

        user.save()
            .then(() => res.json('User updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/getSessions').get((req, res) => {
  User.find().distinct('session', function(error, sessions){
    res.json(sessions)
  }) 
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/list/:session').get((req, res) => {
  User.find({session: req.params.session, role: 'student'})
  .then((students) => res.json(students))
  .catch(err => res.status(400).json(err))
})

router.route('/certs/:id').get((req, res) => {
  Certificate.findById(req.params.id)
    .then(cert => res.json(cert))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/certificate/:session').get((req, res) => {
  Certificate.find()
  .populate('user')
  .exec((err, list) => {
    if(err){
      res.status(400).json(err)
    }
    let finalList = []
    let filteredList = list.filter(s => s.user.session == req.params.session)
    filteredList.forEach(l => {
      finalList.push(l.user)
    })
    res.json(finalList)
  })

})

router.route('/getCertificate/:id').get((req, res) => {
  Certificate.find({user: req.params.id})
  .then(certificate => {
    res.send(certificate)
  })
  .catch(err => res.status(400).json("Err" + err))
})

router.route('/checkCert/:id').get(async (req, res) => {
  Certificate.findById(req.params.id)
  .then(obj => {
    obj.getData()
    .then(blockData => {
      let tempData = {...blockData}
      tempData["_id"] = obj._id
      tempData["txnHash"] = obj.txhash
      res.send(tempData)
    })
    .catch(err => res.status(500).send(err));

  })
  .catch(err => res.status(500).send(err));

})

router.route('/generateCert').post(async (req, res) => {
  let newCert = new Certificate({
    _id: Math.floor(100000 + Math.random() * 900000),
    user: req.body.user._id,
    modules: req.body.arrayModules,
  })

  newCert.save((err, cert) => {
    if(err) {
      res.status(400).send(err)
      return
    };
    cert
    .populate('user')
    .execPopulate()
    .then(async (result) => {
      const qrCodeText = 'http://192.168.0.115:3000/certCheck/'+result._id
      const url = await QRCode.toDataURL(qrCodeText)
      req.body.url = url
      req.body.certId = result._id

      pdf.create(pdfTemplate(req.body), {}).toFile(`../src/certs/${result._id}.pdf`, (err) => {
        if(err) {
            return console.log('error');
        }
        
        sendEmail({
            to: req.body.user.email,
            subject: "Certificate of Completion for Skills Enhancement Modules",
            text: "Congratulations! You have been awarded this certificate as a proof of completion throughout your academic years!",
            attachments: [
                      {
                          filename: `${result._id}.pdf`,
                          path: `../src/certs/${result._id}.pdf`,
                      },
                ],
        })    
      })
  // res.send(Promise.resolve())
      const dbRes = result
       result.deployBlockchain()
       .then(data => {
          const { transactionHash, blockHash } = data.receipt;
          Certificate.updateOne(
            {user: dbRes.user._id}, 
            {txhash : transactionHash },
            {multi:true}, 
              function(err, numberAffected){  

              });

          res.status(201).send({
            receipt: {
              transactionHash,
              blockHash
            },
            data: dbRes
          });
       })
       .catch(err => res.status(500).send(err));
    })
  })
})

module.exports = router;