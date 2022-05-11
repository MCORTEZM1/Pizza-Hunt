const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
    {
        replyId: { 
            // create a unique identifier for id instead of default id. Still going to be the same type of ObjectId value.
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: { 
            type: String,
            required: true,
            trim: true
        },
        writtenBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: true,
            trim: true
        },
        commentBody: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // replies are nested directly in comment document and not referred to. 
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true, // added to get total reply count
            getters: true
        },
        id: false
    }
);

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
})

const Comment = model('Comment', CommentSchema);

module.exports = Comment;