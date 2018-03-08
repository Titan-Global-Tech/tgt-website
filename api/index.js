var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = require('bluebird');
var assert = require('assert');
var config = require('../server/config');



mongoose.connect(config.mongodbUri + '/titan-global-tech');
var Schema = mongoose.Schema;

var contestsSchema = new Schema({
    categoryName: {type: String, required: true},
    contestName: {type: String, required: true},
    nameIds: {type: Array, required: false}
});

var Contests = mongoose.model('Contests', contestsSchema);


router.get('/contests', function(req, res, next) {
    var contests = {};

    Contests.find({}, ['categoryName', 'contestName', 'description'],
        {sort: {contestName: 1}}
    ).then((docs) => {

        docs.forEach((contest) => {
            contests[contest._id] = contest;
        });
        return contests;
    }).then((contests) => res.send({ contests: contests })
    ).catch((err) => {
        console.error(err);
        throw err;
    });
});


module.exports = router;