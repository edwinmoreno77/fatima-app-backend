const { Router } = require('express');
const { check } = require('express-validator');
const { fileUpload, updateImage } = require('../controllers/uploads');

const { validateFields, uploadFileValidator } = require('../middlewares');
const { validCollection } = require('../helpers')

const router = Router();


router.post('/', uploadFileValidator, fileUpload)

router.put('/:collection/:id', [
    uploadFileValidator,
    check('id', 'not is Mongo Id').isMongoId(),
    check('collection').custom(c => validCollection(c, ['users', 'categories', 'products'])),
    validateFields,
], updateImage)


module.exports = router;