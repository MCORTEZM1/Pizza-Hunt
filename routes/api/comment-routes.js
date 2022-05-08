const router = require('express').Router();
const {
    addComment, 
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');


// append /api/comments/:pizzaId 
router.route('/:pizzaId').post(addComment);

// append /api/comments/<pizzaId>/<commentId>
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment)
;

// append /api/comments/<pizzaId>/<commentId>/<replyId>
// go to this pizza, look at this comment, and delete this reply
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);



module.exports = router; 