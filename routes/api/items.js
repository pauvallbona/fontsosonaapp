const express = require('express');
const router = express.Router();

const Item = require('../../models/Item');

router.get('/', (req, res) => {
    Item.find()
    .then(items => res.json(items))
});

router.post('/', (req, res) => {
    const newItem = new Item({
        info: req.body.info   
    });

    newItem.save().then(item => res.json(item));
});

router.delete('/:id', (req, res) => {
  Item.findById(req.params.id)
  .then(item => item.remove().then(() => res.json({succcess:true})))
  .catch(err => res.status(404).json({ succcess:false }));
});


module.exports = router;