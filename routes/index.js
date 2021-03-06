const express = require('express');
const router = express.Router();
const paginate = require('../middlewares/pagination');
const Gage = require('../models/GageSchema');

router.get('/download/:file',(req, res) => {
  res.download(`${__dirname}/static/${req.params.file}`); 
});

router.get('/getUserStatus/:account', async (req, res) => {
  await Gage.find({ receiver: req.params.account, status: 'active' }, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

router.get('/getAllGages/:account/:status', async (req, res) => {
  const data = await paginate(
    req,
    Gage,
    Gage.find({ status: req.params.status.toLowerCase(), receiver: req.params.account }).sort({ id: 1 })
  )();
  res.json(data);
});

router.post('/find-gage', async (req, res) => {
  await Gage.find(
    {
      type: req.body.type,
      receiver: req.body.receiver,
      deposit: req.body.deposit,
      status: 'active'
    },
    (err, data) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json(data);
      return;
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

router.post('/findAndUpdateGageStatus', async (req, res) => {
  Gage.updateOne({ id: req.body.id }, { $set: { status: req.body.status, winner: req.body.winner  } }, (err, data) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json({ result: data });
    return;
  });
});

router.post('/register-user-gage', async (req, res) => {
  const userGage = new Gage({
    id: req.body.id,
    type: req.body.type,
    receiver: req.body.receiver,
    deposit: req.body.deposit,
    status: 'active'
  });

  userGage
    .save()
    .then((values) => {
      res.json({ result: values });
      return;
    })
    .catch((err) => {
      res.json(err);
      return;
    });
});

module.exports = router;
