const express = require ('express');
const mongoose = require ('mongoose');
const {body, validationResult} = require ('express-validator');
const path = require ('path');
const auth = require ('http-auth');

const router = express.Router ();
const Registration = mongoose.model ('Registration');
const basic = auth.basic ({
  file: path.join (__dirname, '../users.htpasswd'),
});

router.get ('/', (req, res) => {
  res.render ('form', {title: 'Registration Form'});
});

router.get ('/registrations', auth.connect (basic), (req, res) => {
  Registration.find ()
    .then (data => {
      res.render ('index', {
        title: 'Listing registrations',
        registrations: data,
      });
    })
    .catch (() => res.send ('Sorry!, Something went wrong.'));
});

router.post (
  '/',
  [
    body ('name').isLength ({min: 1}).withMessage ('Please enter a name'),
    body ('email').isLength ({min: 1}).withMessage ('Please enter an email'),
  ],
  (req, res) => {
    console.log (req.body);
    const errors = validationResult (req);
    console.log (errors);
    if (errors.isEmpty ()) {
      const registration = new Registration (req.body);
      registration
        .save ()
        .then (() => res.send ('Thank you for your registration!'))
        .catch (() => res.send ('Sorry! Something went wrong.'));
    } else {
      res.render ('form', {
        title: 'Registration Form',
        errors: errors.array (),
        data: req.body,
      });
    }
  }
);

module.exports = router;
