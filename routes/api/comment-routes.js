const router = require('express').Router();
const {
    addComment, 
    removeComment
} = require('../../controllers/comment-controller');


// prepend /api/comments/:pizzaId 
router.route('/:pizzaId').post(addComment);

// prepend /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);



module.exports = router; 