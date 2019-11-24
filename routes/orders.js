var express = require('express');
var router = express.Router();
const fs = require('fs');
const Papa = require('papaparse');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/get-orders', (req, res, next) => {
  const ss = fs.readFileSync('./orders.csv', 'utf8');
  const { offset, limit } = req.query;
  const orders = {}
  Papa.parse(ss, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      global.orders = results.data;
      orders.data = results.data
      orders.errors = results.errors
      orders.meta = results.meta
      const size = results.data.length
      res.send({
        orders: orders.data.splice(offset, limit),
        size
      })
    }
  });
})

router.get('/all-them-or  ders', (req, res, next) => {
  console.log(global.orders.length)
  res.send('Hafeez')
})
module.exports = router;
