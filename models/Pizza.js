const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date, 
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String, 
            default: 'Large'
        },
        toppings: [], // can also {type: Array}
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment' // tells Pizza model which document to search to find the right comments
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false // this is a virtual that Mongoose returns and we dont need id
    }    
);

// get total count of comments and replies on retrieval 
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// create the Pizza model using the PizzaSchema 
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model 
module.exports = Pizza; 