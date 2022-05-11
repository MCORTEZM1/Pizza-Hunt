const req = require('express/lib/request');
const { Pizza } = require('../models');

const pizzaController = {
    // get all pizzas 
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: 'comments',
                select: '-__v' // tells mongoose that we dont care about __v field
                // - sign in front of the field indicates that we dont want it returned
                // without the `-` and only `__v` we would only get the __v data 
            })
            .select('-__v') // removing it from returned pizza data as well 
            .sort({ _id: -1 }) // returns the newest pizza first in DESC order
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id 
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                // if no pizza found, send 404 
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id! '});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // POST handle, createPizza 
    createPizza({ body }, res) {
        Pizza.create(body)
            // .create() is the equivalent of MongoDB methods insertOne() and insertMany(), .create() from Mongoose handles both. 
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err))
    },

    // update pizza by id 
    updatePizza({ params, body}, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
            // Needs runValidators so it knows to validate new information! Since validate only runs on create.
            // .findOneAndUpdate() finds a single document to update, updates, then returns the document.
            // {new: true} instructs Mongoose to return the new version of the document.
            // .updateOne() and .updateMany() do not return the document
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id' });
                    return; 
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(400).json(err));
    },

    // delete pizza 
    deletePizza({ params }, res) {
        Pizza.findByIdAndDelete({ _id: params.id })
            // .findByIdAndDelete() returns the document and deletes it.
            // .deleteOne() and .deleteMany() do not return the document
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(400).json(err));
    }
};

module.exports = pizzaController; 