const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String,
            required: 'You need to provide a pizza name', //Mongoose only executes the validators automatically when we actually create new data, not updates!
            trim: true, // removes white spaces from before and after the string. 
        },
        createdBy: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date, 
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String, 
            default: 'Large',
            required: true,
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
    // using reduce method to to tally up the total of every comment with its replies.
    // reduce(accumulator, currentValue); 
    // here total = accumulator and currentValue = comment
    // As .reduce() walks through the array, it passes the accumulating total and the current 
    // value of comment into the function, with the return of the function revising the total 
    // for the next iteration through the array.
});

// create the Pizza model using the PizzaSchema 
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model 
module.exports = Pizza; 