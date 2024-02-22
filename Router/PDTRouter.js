const express = require('express');

const {
    get_sample_query,
    start_physical_count,
    get_Start_PC,
    upload_site,
    get_Site_Warehouse,
    get_Site_Warehouse2,
    updateTransactionStatus,
    upload_on_hand,
    get_On_Hand,
    get_batch_number,
    create_batch_number,
    get_ax_data,
    get_PC_Records,
    insert_PC_Record,
    get_site_warehouse_loc,
    get_item_masterfile,
    get_variants_masterfile,
    get_Item_Details,
    get_Details,
    get_on_hand_random_count,
    post_update,
    post_update_bulk,
    get_on_hand_for_variance,
    get_scanned_vs_on_hand,
    check_unique_code,
    getOnForCaseBarcode_B20,
    get_Item_Details_b20_onhand_FG
} = require('../Controller/PDTController');

const router = express.Router();

/**Get sample query */
router.get('/get_sample_query', get_sample_query);


/**Post Start Physical Count */
router.post('/start_physical_count', start_physical_count);


/**Post Start Physical Count */
router.post('/upload_site', upload_site);

/**Post upload onhand */
router.post('/upload_on_hand', upload_on_hand);

/**Post batch number */
router.post('/create_batch_number',create_batch_number);

/**Post PC Records */
router.post('/insert_PC_Record', insert_PC_Record);


/**Get */

/**Get casebarcode on onhand and display the item quantity and location for FG items save in our database */
router.get('/get_Item_Details_b20_onhand_FG', get_Item_Details_b20_onhand_FG);

/**Get site and warehouse from ax and save in our database */
router.get('/get_site_warehouse_loc', get_site_warehouse_loc);

/**Get item masterfile from ax and save in our database */
router.get('/get_item_masterfile', get_item_masterfile)

/**Get variants masterfile from ax and save in our database */
router.get('/get_variants_masterfile', get_variants_masterfile)

/**Get the transactions */
router.get('/get_Start_PC', get_Start_PC);

/**Get Physical count record */
router.get('/get_PC_Records',get_PC_Records)

/**Get on hand for variance report */
router.get('/get_on_hand_for_variance',get_on_hand_for_variance)

/**Get on hand for variance report */
router.get('/getOnForCaseBarcode_B20',getOnForCaseBarcode_B20)

/**Get scanned vs onhand */
router.get('/get_scanned_vs_on_hand',get_scanned_vs_on_hand)

/**check if unique code exist */
router.get('/check_unique_code',check_unique_code)
/**=============================== ON HAND========================= */
/**Get the On hand */
router.get('/get_On_Hand', get_On_Hand)

/**Get the On hand for random count */
router.get('/get_on_hand_random_count', get_on_hand_random_count)
/**=============================== ON HAND========================= */

/**Get product details from item and variant masterfile */
router.get('/get_Item_Details', get_Item_Details);

/**Get product details from item and variant masterfile and save into cachedData 
 * in controller */
router.get('/get_Details', get_Details);

/**Get the Batch number */
router.get('/get_batch_number', get_batch_number);

/**get the site and warehouse */
router.get('/get_Site_Warehouse', get_Site_Warehouse);

/**get the site and warehouse2 */
router.get('/get_Site_Warehouse2', get_Site_Warehouse2);

/**Get data from ax MSSQL server*/
router.get('/get_ax_data',get_ax_data)
/**PUT */
/**Update the Disable_in_Mobile  status*/
router.put('/updateTransactionStatus/:id',updateTransactionStatus);

/**Update the Disable_in_Mobile  status*/
router.put('/post_update/:id',post_update);

router.put('/post_update_bulk',post_update_bulk);
module.exports = router;