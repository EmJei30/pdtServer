const express = require('express');
const {
    getTransactionDetails,
    insertTransaction,
    // getTransactionNumberCurrent,
    getTransactionCurrent,
    getStartOfDay,
    insertStartTransaction,
    DRandISCurrent,
    getPumpReading,
    registerUser
} = require('../Controller/DieselController');

const router = express.Router();

/**Get DR and IS number */
router.get('/details', getTransactionDetails);

/**Get the start of the day*/
router.get('/beginning', getStartOfDay);

/**Get the start of the day*/
router.get('/pump', getPumpReading);

/**Get DR and IS number */
// router.get('/TRN', getTransactionNumberCurrent);

/**Get DR and IS number */
router.get('/', DRandISCurrent);
/**Get DR and IS number */
router.get('/currentTransaction', getTransactionCurrent);

/**Insert Record */
router.post('/insertTransaction', insertTransaction);

/**Start Transaction */
router.post('/startTranscation', insertStartTransaction);


/**Register user */
router.post('/register', registerUser);
module.exports = router;