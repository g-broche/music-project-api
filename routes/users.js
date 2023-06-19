var express = require('express');
var router = express.Router();

const users = [
  { name: "Camille", age: 30 },
  { name: "Nicolas", age: 60 },
  { name: "Leah", age: 2 },
]

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(users);
});
router.get('/delete/:name', function (req, res, next) {
  let i = users.findIndex(u => u.name == req.params.name)
  users.splice(i, 1)
  res.send(users);
});
router.get('/:name/birthday', function (req, res, next) {
  let birthdayPerson = users.find(u => u.name == req.params.name)
  birthdayPerson.age++
  res.send(users);
});
router.post('/', function (req, res, next) {
  res.send(req.body);
});

module.exports = router;
