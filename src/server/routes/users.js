'use strict';

const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const Users = require('../modules/users');
const users_profile = require('./users_profile');
const knex = require('../db/connection.js');
const Places = require('../modules/places');
const Plans = require('../modules/plans');
///users/2/plans/new

router.post('/:user_id/plans/new', (req, res,next) => {

  console.log('req.params.user_id',req.params.user_id);
  let newPlan = req.body;
  newPlan.user_id = req.params.user_id;

  Plans.insert(newPlan).then((result) => {

    res.redirect('/index');

  });
});

router.post('/:user_id/plans/:plan_id/places/new', (req, res,next) => {

  let newPlace = req.body;
  newPlace.plan_id = parseInt(req.params.plan_id);

  Places.insert(newPlace).then(() => {
    res.redirect('/index');

  });
  // }else {
  //   res.redirect('/index');
  // }
});






router.use('/profile', users_profile);

router.get('/signup', function(req, res) {
  res.locals.loggedIn = req.session.loggedIn || false;
  res.render('pages/signup');
});

router.post('/signup', function(req, res) {

  Users.withEmail(req.body.email)
    .then(function(user) {
      if (!user) {
        let pBcryptHash = new Promise((resolve) => {
          resolve(bcrypt.hashSync(req.body.password));
        });

        pBcryptHash.then((hashed_password) => {

          Users.insert({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            username: req.body.username,
            password: hashed_password
          }).then(function(newUser) {

            req.session.user = newUser;
            req.session.loggedIn = true;

            res.locals.user = newUser;
            res.locals.loggedIn = true;

            res.redirect('/');

          });

        });
      } else {
        res.send('User created');
      }
    });
});

router.get('/login', function(req, res) {
  res.locals.loggedIn = req.session.loggedIn || false;
  res.render('pages/login');
});

router.post('/login', function(req, res) {


  Users.withEmail(req.body.email)
    .then(function(user) {

      if (!user) {
        res.redirect('/users/signup');
      }

      let pBcryptCompare = new Promise((resolve) => {
        resolve(bcrypt.compareSync(req.body.password, user.password));
      });

      pBcryptCompare.then((result) => {

        if (result) {

          req.session.user = user;
          req.session.loggedIn = true;

          res.locals.user = user;
          res.locals.loggedIn = true;

          res.redirect('/');

        } else {
          res.render('pages/login');
        }
      });
    });
});

router.get('/:id/plans', function(req, res, next) {

  var userID = Number.parseInt(req.params.id);

  res.locals.page_type = 'My Plans';

  knex('plans').where('user_id', '=', userID).then(function(plans) {
    res.render('pages/plans', {
      plans: plans,
    });
  });
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  req.session.loggedIn = false;
  res.redirect('/users/login');
});

module.exports = router;
