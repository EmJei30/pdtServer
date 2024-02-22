const connection = require('../Database/connection');
const bcrypt = require('bcrypt');

/** Function to execute SQL queries / get all products*/
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

/**Get beginning Transaction and display all transaction */
const getStartOfDay = async (req, res) =>{
    console.log(req.query.branch_user)
    const user = req.query.branch_user;
    let database = '';
    if(user === 'BAESA'){
        database = 'baesa_transaction_database';
    }
    // else if (user === 'SAMAL'){
    //     database = 'samal_transaction_database';
    // }

    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
            res.json(results);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Get Transaction and display all transaction in Details */
const getTransactionCurrent = async (req, res) =>{
    console.log(req.query.branch_user)
    const user = req.query.branch_user;
    let database = '';
    if(user === 'BAESA'){
        database = 'baesa_transaction_database';
    }else if (user === 'SAMAL'){
        database = 'samal_transaction_database';
    }

    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
            res.json(results);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Get Transaction and display all transaction in Details */
const DRandISCurrent = async (req, res) =>{
    // console.log(req.query.branch_user)
    const user = req.query.branch_user;
    let database = '';
    let database2 = '';
    if(user === 'BAESA'){
        database = 'baesa_transaction_database';
        database2 = 'baesa_database';
    }else if (user === 'SAMAL'){
        database = 'samal_transaction_database';
        database2 = 'samal_database';
    }

    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
        // const filteredResults = results.filter((transaction) => transaction.Branch_Transaction !== 'Start Of Day');

        if(results.length > 0){
            res.json(results);
            console.log(results)
        }else{
            try {
                const query = `SELECT * FROM ${database2}`;
                const result = await executeQuery(query);
                res.json(result);
              } catch (error) {
                console.error('Error:', error);
                res.status(500).send('An error occurred while retrieving the products.');
              }
        }
       
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while retrieving the products.');
    }
};
// /**Get Transaction and display all transaction in Details */
// const getTransactionNumberCurrent = async (req, res) =>{
//     console.log('trnumber', req.query.branch_user)
//     const user = req.query.branch_user;
//     let database = '';
//     let database2 = '';
//     let database3 = '';
//     if(user === 'BAESA'){
//         database = 'baesa_start_transaction';
//         database2 = 'baesa_transaction_database';
//         database3 = 'baesa_database';
//     }else if (user === 'SAMAL'){
//         database = 'samal_start_transaction';
//         database2 = 'samal_transaction_database';
//         database3 = 'samal_database';
//     }
// console.log('databaes',database, database2 ,database3)
//     try {
//         if (database) {
//             const query1 = `SELECT * FROM ${database}`;
//             const results = await executeQuery(query1);
//             if(results.length > 0){
//                 try {
//                     const query2 = `SELECT * FROM ${database2}`;
//                     const result = await executeQuery(query2);
//                     if(result.length > 0){
//                         res.json(result);
//                         console.log(result)
//                     }else{
//                         try {
//                             const query3 = `SELECT * FROM ${database3}`;
//                             const resu = await executeQuery(query3);
//                             res.json(resu);
//                             console.log(resu)
//                         } catch (error) {
//                             console.error('Error:', error);
//                             res.status(500).send('An error occurred while retrieving the products.');
//                         }
//                     }
                
//                 } catch (error) {
//                     console.error('Error:', error);
//                     res.status(500).send('An error occurred while retrieving the products.');
//                 }  
              
//             }else{
//                 res.json(results);
//                 console.log(results)
//             }
//     } else {
//        console.log('database is empty')
//     }
//       } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('An error occurred while retrieving the products.');
//       }
// };

/**Get Transaction and display all transaction in Details */
const getTransactionDetails = async (req, res) =>{
    console.log(req.query.branch_user)
    const user = req.query.branch_user;
    let database = '';
    if(user === 'BAESA'){
        database = 'baesa_database';
    }else if (user === 'SAMAL'){
        database = 'samal_database';
    }

    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
        res.json(results);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Get pump reading when loading from log in, transaction, issuance and delivery */
const getPumpReading = async (req, res) =>{
    console.log('trnumber', req.query.branch_user)
    const user = req.query.branch_user;
    let database = '';
    let database2 = '';
    if(user === 'BAESA'){
        database = 'baesa_transaction_database';
        database2 = 'baesa_database';
    }else if (user === 'SAMAL'){
        database = 'samal_transaction_database';
        database2 = 'samal_database';
    }
    try {
        if (database) {
            const query1 = `SELECT * FROM ${database}`;
            const results = await executeQuery(query1);
            if(results.length > 0){
                res.json(results);
                console.log(results)
            }else{
                try {
                    const query2 = `SELECT * FROM ${database2}`;
                    const result = await executeQuery(query2);
                    if(result.length > 0){
                        res.json(result);
                        console.log(result)
                    }else{
                        console.log('no data in pump');
                        res.json(result);
                    }          
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).send('An error occurred while retrieving the products.');
                }  
            }
    } else {
       console.log('database is empty')
    }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Insert Transaction Received*/
const insertTransaction = (req, res) =>{
    console.log('req',req.body)
    const transaction = req.body.branch_transaction;
    const branch = req.body.active_User;

    console.log('trans' ,transaction);
    console.log('branch', branch);
    let data = [];
    let database = '';
    let newRecord = [];
    if(branch === 'BAESA'){
        database = 'baesa_transaction_database';
    }else if(branch === 'SAMAL'){
        database = 'samal_transaction_database';
    }   
    if(transaction === 'Delivery'){

         data = {
            referenceNumber,
            invoiceNumber, // 'asd', var
            transaction_Date, // '2023-09-08', datetime
            truckNumber, // 'as',  var
            timeIn, // '213', var 
            timeOut, // '123', var
            manholeCover1, // '12312', bigint
            manholeCover2, // '',bigint
            manholeCover3, // '',bigint 
            manholeCover4, // '',bigint 
            sealIntact1, // 'Yes', var
            sealIntact2, // '',var
            sealIntact3, // '', var
            sealIntact4, // '', var 
            productLevelReach1, // 'Yes', var 
            productLevelReach2, // '', var 
            productLevelReach3, // '', var  var 
            productLevelReach4, // '', var 
            waterFindingPaste1, // 'Passed', var 
            waterFindingPaste2, // '', var 
            waterFindingPaste3, // '', var 
            waterFindingPaste4, // '', var 
            sealNumber1, // '123213', bigint
            sealNumber2, // '', bigint
            sealNumber3, // '', bigint
            sealNumber4, // '', bigint
            driversName, // 'sadasd', var 
            WHLRepresentative, // 'asdas',var 
            initial_sounding, // '11', dec
            initial_conversion_in_li, // 329, dec
            final_sounding, // '112', dec
            final_conversion_in_li, // 8801.7, dec
            drained_Products, // '', dec
            total_Volume_Deliveries, // '8500', dec
            volume_variance, // '-27.30', dec
            percentage_variance, // '-0.32', dec
            branch_transaction, // 'RECEIVED',var
            active_User, // 'BAESA', var
            TRNumber, // 'TRN-000000001', var
            DRNumber, // 'DRN-000000001' var
            Delivery_Computed,
            OnHand,
            attach_pic,
            Weight_in,
            Weight_Out,
            computed_weight,
            weight_in_li,
            density
        } = req.body;

        const inputDateTime = transaction_Date;
        const parts = inputDateTime.split(" ");
        const datePart = parts[0];
        const timePart = parts[1];
        
        const dateComponents = datePart.split("-");
        const year = dateComponents[0];
        const month = dateComponents[1];
        const day = dateComponents[2];
        
        const formattedDate = `${month}-${day}-${year}`;
        console.log(formattedDate);
        const imanholeCover1 = !isNaN(manholeCover1) && manholeCover1 !== '' ? parseInt(manholeCover1) : null;
        const imanholeCover2 = !isNaN(manholeCover2) && manholeCover2 !== '' ? parseInt(manholeCover2) : null;
        const imanholeCover3 = !isNaN(manholeCover3) && manholeCover3 !== '' ? parseInt(manholeCover3) : null;
        const imanholeCover4 = !isNaN(manholeCover4) && manholeCover4 !== '' ? parseInt(manholeCover4) : null;

        const isealNumber1 = !isNaN(sealNumber1) && sealNumber1 !== '' ? parseInt(sealNumber1) : null;
        const isealNumber2 = !isNaN(sealNumber2) && sealNumber2 !== '' ? parseInt(sealNumber2) : null;
        const isealNumber3 = !isNaN(sealNumber3) && sealNumber3 !== '' ? parseInt(sealNumber3) : null;
        const isealNumber4 = !isNaN(sealNumber4) && sealNumber4 !== '' ? parseInt(sealNumber4) : null;

        const iinitial_sounding = !isNaN(initial_sounding) && initial_sounding !== '' ? parseFloat( initial_sounding) : null;
        const iinitial_conversion_in_li = !isNaN(initial_conversion_in_li) && initial_conversion_in_li !== '' ? parseFloat( initial_conversion_in_li) : null;
        const ifinal_sounding = !isNaN(final_sounding) && final_sounding !== '' ? parseFloat( final_sounding) : null;
        const ifinal_conversion_in_li = !isNaN(final_conversion_in_li) && final_conversion_in_li !== '' ? parseFloat( final_conversion_in_li) : null;
        const idrained_Products = !isNaN(drained_Products) && drained_Products !== '' ? parseFloat( drained_Products) : null;
        const itotal_Volume_Deliveries = !isNaN(total_Volume_Deliveries) && total_Volume_Deliveries !== '' ? parseFloat( total_Volume_Deliveries) : null;
        const ivolume_variance = !isNaN(volume_variance) && volume_variance !== '' ? parseFloat( volume_variance) : null;
        const ipercentage_variance = !isNaN(percentage_variance) && percentage_variance !== '' ? parseFloat( percentage_variance) : null;
        const iDelivery_Computed = !isNaN(Delivery_Computed) && Delivery_Computed !== '' ? parseFloat( Delivery_Computed) : null;
        const iOnHand = !isNaN(OnHand) && OnHand !== '' ? parseFloat( OnHand) : null;

        const iWeight_in = !isNaN(Weight_in) && Weight_in !== '' ? parseFloat( Weight_in) : null;
        const iWeight_Out = !isNaN( Weight_Out) &&  Weight_Out !== '' ? parseFloat(  Weight_Out) : null;
        const icomputed_weight = !isNaN( computed_weight) &&  computed_weight !== '' ? parseFloat(  computed_weight) : null;
        const iweight_in_li = !isNaN(weight_in_li) && weight_in_li !== '' ? parseFloat( weight_in_li) : null;
        const idensity = !isNaN(density) && density !== '' ? parseFloat( density) : null;
       

        newRecord = {
            Reference_Number: referenceNumber,
            Transaction_Number : TRNumber,
            Transaction_Date : new Date(transaction_Date),
            Department : null,
            Cost_Center : null,
            Personal: null,
            Item_Code : null,
            Issuance_Date : null,
            Issuance_Number : null,
            Plate_Number : null, 
            Initial_Reading_Pump_Counter : null,
            Final_Reading_Pump_Counter : null,
            Branch_Transaction : branch_transaction,
            Pump_Counter_Difference : null,
            Quantity_Ordered: null,
            Quantity_Issued: null,
            UM: null,
            Discrepancy : null,
            Actual_Tank_Volume: null,
            Issue_Remarks: null,
            Requested_By: null,
            Approved_By: null,
            Received_By: null,
            Issued_By: null,
            Posted_By: null,
            Issuance_Attachment: null,
            Delivery_Receipt_Number: DRNumber,
            Delivery_Date: new Date(transaction_Date),
            Time_In: timeIn, 
            Time_Out:timeOut,
            Invoice_number: invoiceNumber,
            Truck_Number: truckNumber,
            M1_Seal_Number_Cover: imanholeCover1,
            M2_Seal_Number_Cover: imanholeCover2,
            M3_Seal_Number_Cover: imanholeCover3,
            M4_Seal_Number_Cover: imanholeCover4,
            M1_Seal_Intact: sealIntact1,
            M2_Seal_Intact: sealIntact2, 
            M3_Seal_Intact: sealIntact3,
            M4_Seal_Intact: sealIntact4,
            M1_Product_Gauge: productLevelReach1,
            M2_Product_Gauge: productLevelReach2,
            M3_Product_Gauge: productLevelReach3,
            M4_Product_Gauge: productLevelReach4,
            M1_Water_Finding_Paste: waterFindingPaste1,
            M2_Water_Finding_Paste: waterFindingPaste2,
            M3_Water_Finding_Paste: waterFindingPaste3,
            M4_Water_Finding_Paste: waterFindingPaste4,
            M1_Seal_Number: isealNumber1,
            M2_Seal_Number: isealNumber2,
            M3_Seal_Number: isealNumber3,
            M4_Seal_Number: isealNumber4,
            Initial_Sounding: iinitial_sounding,
            Initial_Conversion: iinitial_conversion_in_li,
            Final_Sounding: ifinal_sounding,
            Final_Conversion: ifinal_conversion_in_li,
            Drained_Products: idrained_Products,
            Total_Volume_Deliveries: itotal_Volume_Deliveries,
            Volume_Variance: ivolume_variance,
            Percent_Variance: ipercentage_variance,
            Drivers_Name: driversName,
            WHL_Representative: WHLRepresentative,
            Delivery_Attachment: null,
            Delivery_Computed: iDelivery_Computed,
            Beginning_cm: null,
            Beginning_li: null,
            Ending_li: null,
            Ending_cm: null,
            Computed_Counter_before: null,
            Computed_Counter_after: null,
            On_Hand: iOnHand,
            Weight_in: iWeight_in,
            Weight_Out : iWeight_Out,
            computed_weight : icomputed_weight,
            weight_in_li:iweight_in_li,
            density:idensity,
            Manual_Pump_Counter_difference: null,
            Created_At: new Date(),
            Updated_At: new Date(),
            routeOriginTime1 : null,
            routeOriginOdometer1 : null,
            routeDestination1:null,
            routeDestinationTime1 : null,
            routeDestinationOdometer1: null ,
            routeOrigin2 : null,
            routeOriginTime2: null ,
            routeOriginOdometer2 : null,
            routeDestination2 : null ,
            routeDestinationTime2 : null,
            routeDestinationOdometer2 : null,
            routeOrigin3: null ,
            routeOriginTime3 : null,
            routeOriginOdometer3  : null,
            routeDestination3 :null,
            routeDestinationTime3 : null,
            routeDestinationOdometer3 : null,
            
            routeOrigin4 : null,
            routeOriginTime4  : null,
            routeOriginOdometer4  : null,
            routeDestination4 : null,
            routeDestinationTime4 : null,
            routeDestinationOdometer4 : null,
            
            travelled1 : null,
            travelled2  : null,
            travelled3  : null,
            travelled4 : null,
            
            clients : null,
            totalOdometer : null,
            averageKm:null
        }
    }else if(transaction === 'Issuance'){
        console.log(req.body)
        data = {
            referenceNumber,
            transaction_Date,
            timeIn,
            department,
            cost_center,
            personal,
            plate_number,
            quantity_requested,
            initial_sounding,
            quantity_issued,
            final_sounding,
            Requested_by,
            Approved_by,
            Issued_by,
            Posted_by,
            branch_transaction,
            active_User, 
            TRNumber,
            ISNumber,
            Computed_Counted_Before,
            Computed_Counted_After,
            OnHand,
            Manual_Pump_Counter_difference,
            routeOrigin1 ,
            routeOriginTime1,
            routeOriginOdometer1 ,
            routeDestination1 ,
            routeDestinationTime1,
            routeDestinationOdometer1 ,
            routeOrigin2 ,
            routeOriginTime2 ,
            routeOriginOdometer2 ,
            routeDestination2 ,
            routeDestinationTime2 ,
            routeDestinationOdometer2 ,
            routeOrigin3 ,
            routeOriginTime3 ,
            routeOriginOdometer3 ,
            routeDestination3 ,
            routeDestinationTime3 ,
            routeDestinationOdometer3 ,
            routeOrigin4 ,
            routeOriginTime4 ,
            routeOriginOdometer4 ,
            routeDestination4 ,
            routeDestinationTime4 ,
            routeDestinationOdometer4 ,
            travelled1 ,
            travelled2 ,
            travelled3 ,
            travelled4 ,
            clients,
            totalOdometer,
            averageKm

        } = req.body;

        const iinitial_sounding = !isNaN(initial_sounding) && initial_sounding !== '' ? parseFloat( initial_sounding) : null;
        const ifinal_sounding = !isNaN(final_sounding) && final_sounding !== '' ? parseFloat( final_sounding) : null;
        const iquantity_requested = !isNaN(quantity_requested) && quantity_requested !== '' ? parseFloat( quantity_requested) : null;
        const iquantity_issued = !isNaN(quantity_issued) && quantity_issued !== '' ? parseFloat( quantity_issued) : null;
        const iComputed_Counter_before = !isNaN(Computed_Counted_Before) && Computed_Counted_Before !== '' ? parseFloat( Computed_Counted_Before) : null;
        const iComputed_Counter_after = !isNaN(Computed_Counted_After) && Computed_Counted_After !== '' ? parseFloat( Computed_Counted_After) : null;
        const iOnHand = !isNaN(OnHand) && OnHand !== '' ? parseFloat( OnHand) : null;

        const irouteOriginOdometer1 = !isNaN(routeOriginOdometer1) && routeOriginOdometer1 !== '' ? parseInt( routeOriginOdometer1) : null;
        const irouteDestinationOdometer1 = !isNaN(routeDestinationOdometer1) && routeDestinationOdometer1 !== '' ? parseInt( routeDestinationOdometer1) : null;
        const irouteOriginOdometer2 = !isNaN(routeOriginOdometer2) && routeOriginOdometer2 !== '' ? parseInt( routeOriginOdometer2) : null;
        const irouteDestinationOdometer2 = !isNaN(routeDestinationOdometer2) && routeDestinationOdometer2 !== '' ? parseInt( routeDestinationOdometer2) : null;
        const irouteOriginOdometer3 = !isNaN(routeOriginOdometer3) && routeOriginOdometer3 !== '' ? parseInt( routeOriginOdometer3) : null;
        const irouteDestinationOdometer3 = !isNaN(routeDestinationOdometer3) && routeDestinationOdometer3 !== '' ? parseInt( routeDestinationOdometer3) : null;
        const irouteOriginOdometer4 = !isNaN(routeOriginOdometer4) && routeOriginOdometer4 !== '' ? parseInt( routeOriginOdometer4) : null;
        const irouteDestinationOdometer4 = !isNaN(routeDestinationOdometer4) && routeDestinationOdometer4 !== '' ? parseInt( routeDestinationOdometer4) : null;

        const itravelled1 = !isNaN(travelled1) && travelled1 !== '' ? parseInt( travelled1) : null;
        const itravelled2 = !isNaN(travelled2) && travelled2 !== '' ? parseInt( travelled2) : null;
        const itravelled3 = !isNaN(travelled3) && travelled3 !== '' ? parseInt( travelled3) : null;
        const itravelled4 = !isNaN(travelled4) && travelled4 !== '' ? parseInt( travelled4) : null;
        const iclients = !isNaN(clients) && clients !== '' ? parseInt( clients) : null;
        const itotalOdometer = !isNaN(totalOdometer) && totalOdometer !== '' ? parseInt( totalOdometer) : null;
        const iaverageKm = !isNaN(averageKm) && averageKm !== '' ? parseFloat( averageKm) : null;


        newRecord = {
            Reference_Number: referenceNumber,
            Transaction_Number : TRNumber,
            Transaction_Date : new Date(transaction_Date),
            Department : department,
            Cost_Center : cost_center,
            Personal : personal,
            Item_Code : null,
            Issuance_Date : new Date(transaction_Date),
            Issuance_Number : ISNumber,
            Plate_Number : plate_number, 
            Initial_Reading_Pump_Counter : iinitial_sounding,
            Final_Reading_Pump_Counter : ifinal_sounding,
            Branch_Transaction : branch_transaction,
            Pump_Counter_Difference : null,
            Quantity_Ordered: iquantity_requested,
            Quantity_Issued: iquantity_issued,
            UM: null,
            Discrepancy : null,
            Actual_Tank_Volume: null,
            Issue_Remarks: null,
            Requested_By: null,
            Approved_By: null,
            Received_By: null,
            Issued_By: null,
            Posted_By: null,
            Issuance_Attachment: null,
            Delivery_Receipt_Number: null,
            Delivery_Date: null,
            Time_In: timeIn, 
            Time_Out:null,
            Invoice_number: null,
            Truck_Number: null,
            M1_Seal_Number_Cover: null,
            M2_Seal_Number_Cover: null,
            M3_Seal_Number_Cover: null,
            M4_Seal_Number_Cover: null,
            M1_Seal_Intact: null,
            M2_Seal_Intact: null, 
            M3_Seal_Intact: null,
            M4_Seal_Intact: null,
            M1_Product_Gauge: null,
            M2_Product_Gauge: null,
            M3_Product_Gauge: null,
            M4_Product_Gauge: null,
            M1_Water_Finding_Paste: null,
            M2_Water_Finding_Paste: null,
            M3_Water_Finding_Paste: null,
            M4_Water_Finding_Paste: null,
            M1_Seal_Number: null,
            M2_Seal_Number: null,
            M3_Seal_Number: null,
            M4_Seal_Number: null,
            Initial_Sounding: null,
            Initial_Conversion: null,
            Final_Sounding: null,
            Final_Conversion: null,
            Drained_Products: null,
            Total_Volume_Deliveries: null,
            Volume_Variance: null,
            Percent_Variance: null,
            Drivers_Name: null,
            WHL_Representative: null,
            Delivery_Attachment: null,
            Beginning_cm: null,
            Beginning_li: null,
            Ending_li: null,
            Ending_cm: null,
            Delivery_Computed: null,
            Computed_Counter_before: iComputed_Counter_before,
            Computed_Counter_after: iComputed_Counter_after,
            On_Hand: iOnHand,
            Weight_in: null,
            Weight_Out : null,
            computed_weight : null,
            weight_in_li:null,
            density:null,
            Manual_Pump_Counter_difference : Manual_Pump_Counter_difference,
            Created_At: new Date(),
            Updated_At: new Date(),
            routeOrigin1 :routeOrigin1 ,
routeOriginTime1 : routeOriginTime1,
routeOriginOdometer1 : irouteOriginOdometer1,
routeDestination1:routeDestination1,
routeDestinationTime1 : routeDestinationTime1,
routeDestinationOdometer1: irouteDestinationOdometer1 ,
routeOrigin2 : routeOrigin2,
routeOriginTime2: routeOriginTime2 ,
routeOriginOdometer2 : irouteOriginOdometer2,
routeDestination2 : routeDestination2 ,
routeDestinationTime2 : routeDestinationTime2,
routeDestinationOdometer2 : irouteDestinationOdometer2,
routeOrigin3: routeOrigin3 ,
routeOriginTime3 : routeOriginTime3,
routeOriginOdometer3  : irouteOriginOdometer3,
routeDestination3 :routeDestination3,
routeDestinationTime3 : routeDestinationTime3,
routeDestinationOdometer3 : irouteDestinationOdometer3,

routeOrigin4 : routeOrigin4,
routeOriginTime4  : routeOriginTime4,
routeOriginOdometer4  : irouteOriginOdometer4,
routeDestination4 : routeDestination4,
routeDestinationTime4 : routeDestinationTime4,
routeDestinationOdometer4 : irouteDestinationOdometer4,

travelled1 : itravelled1,
travelled2  : itravelled2,
travelled3  : itravelled3,
travelled4 : itravelled4,

clients : iclients,
totalOdometer : itotalOdometer,
averageKm:iaverageKm
        }
    }
  
     /**  Insert the new record to the desired id*/

     const insertQuery = `INSERT INTO ${database} SET ?`;
     connection.query(insertQuery, newRecord, (error, results) => {
         if (error) {
             console.error('An error occurred while inserting the record:', error);
             return;
         }
         res.json({msg :'Data saved successfully'}); 
  });
}

/**Insert Transaction */
const insertStartTransaction = (req, res) =>{
//     console.log('req',req.body)
//     const branch = req.body.active_User;

//     let database = '';
//     let newRecord = [];
//     if(branch === 'BAESA'){
//         database = 'baesa_start_transaction';
  
//         const data = {
//             transactionDate, // '2023-09-08', datetime
//             initial_sounding, // '11', dec
//             initial_conversion_in_li, // 329, dec
//             pump_master_reading,
//             transaction_Number
//         } = req.body;
     
//         const iinitial_sounding = !isNaN(initial_sounding) && initial_sounding !== '' ? parseFloat( initial_sounding) : null;
//         const iinitial_conversion_in_li = !isNaN(initial_conversion_in_li) && initial_conversion_in_li !== '' ? parseFloat( initial_conversion_in_li) : null;
  
//         newRecord = {
//             Date: transactionDate,
//             Beginning_cm: iinitial_sounding,
//             Beginning_li: iinitial_conversion_in_li,
//             Pump_Master_Reading_Before : pump_master_reading,
//             Transaction_Number : transaction_Number,
//             Created_At: new Date(),
//             Updated_At: new Date()
//         }
//     }   
  
//      /**  Insert the new record to the desired id*/

//      const insertQuery = `INSERT INTO ${database} SET ?`;
//      connection.query(insertQuery, newRecord, (error, results) => {
//          if (error) {
//              console.error('An error occurred while inserting the record:', error);
//              return;
//          }
//          res.json({msg :'Data saved successfully'}); 
//   });

  console.log('req',req.body)
  const transaction = req.body.branch_transaction;
  const branch = req.body.active_User;

  console.log('trans' ,transaction);
  console.log('branch', branch);

  let database = '';
  let newRecord = [];
  if(branch === 'BAESA'){
      database = 'baesa_transaction_database';
  }else if(branch === 'SAMAL'){
    database = 'samal_transaction_database';
  }
      const data = {
                    transactionDate, // '2023-09-08', datetime
                    initial_sounding, // '11', dec
                    initial_conversion_in_li, // 329, dec
                    pump_master_reading,
                    transaction_Number,
                    branch_transaction
                } = req.body;

      const iinitial_sounding = !isNaN(initial_sounding) && initial_sounding !== '' ? parseFloat( initial_sounding) : null;
      const iinitial_conversion_in_li = !isNaN(initial_conversion_in_li) && initial_conversion_in_li !== '' ? parseFloat( initial_conversion_in_li) : null;
      const ipump_master_reading = !isNaN(pump_master_reading) && pump_master_reading !== '' ? parseFloat( pump_master_reading) : null;

      newRecord = {
            Beginning_cm: iinitial_sounding,
            Beginning_li: iinitial_conversion_in_li,
            Ending_cm: null,
            Ending_li:null,
          Transaction_Number : transaction_Number,
          Transaction_Date : new Date(transactionDate),
          Department : null,
          Cost_Center : null,
          Personal: null,
          Item_Code : null,
          Issuance_Date : null,
          Issuance_Number : null,
          Plate_Number : null, 
          Initial_Reading_Pump_Counter : ipump_master_reading,
          Final_Reading_Pump_Counter : null,
          Branch_Transaction : branch_transaction,
          Pump_Counter_Difference : null,
          Quantity_Ordered: null,
          Quantity_Issued: null,
          UM: null,
          Discrepancy : null,
          Actual_Tank_Volume: null,
          Issue_Remarks: null,
          Requested_By: null,
          Approved_By: null,
          Received_By: null,
          Issued_By: null,
          Posted_By: null,
          Issuance_Attachment: null,
          Delivery_Receipt_Number: null,
          Delivery_Date: null,
          Time_In: null, 
          Time_Out:null,
          Invoice_number: null,
          Truck_Number: null,
          M1_Seal_Number_Cover: null,
          M2_Seal_Number_Cover: null,
          M3_Seal_Number_Cover: null,
          M4_Seal_Number_Cover: null,
          M1_Seal_Intact: null,
          M2_Seal_Intact: null, 
          M3_Seal_Intact: null,
          M4_Seal_Intact: null,
          M1_Product_Gauge: null,
          M2_Product_Gauge: null,
          M3_Product_Gauge: null,
          M4_Product_Gauge: null,
          M1_Water_Finding_Paste: null,
          M2_Water_Finding_Paste: null,
          M3_Water_Finding_Paste: null,
          M4_Water_Finding_Paste: null,
          M1_Seal_Number: null,
          M2_Seal_Number: null,
          M3_Seal_Number: null,
          M4_Seal_Number: null,
          Initial_Sounding: null,
          Initial_Conversion: null,
          Final_Sounding: null,
          Final_Conversion: null,
          Drained_Products: null,
          Total_Volume_Deliveries: null,
          Volume_Variance: null,
          Percent_Variance: null,
          Drivers_Name: null,
          WHL_Representative: null,
          Delivery_Attachment: null,
          Manual_Pump_Counter_difference: null,
          Created_At: new Date(),
          Updated_At: new Date(),
          routeOriginTime1 : null,
          routeOriginOdometer1 : null,
          routeDestination1:null,
          routeDestinationTime1 : null,
          routeDestinationOdometer1: null ,
          routeOrigin2 : null,
          routeOriginTime2: null ,
          routeOriginOdometer2 : null,
          routeDestination2 : null ,
          routeDestinationTime2 : null,
          routeDestinationOdometer2 : null,
          routeOrigin3: null ,
          routeOriginTime3 : null,
          routeOriginOdometer3  : null,
          routeDestination3 :null,
          routeDestinationTime3 : null,
          routeDestinationOdometer3 : null,
          
          routeOrigin4 : null,
          routeOriginTime4  : null,
          routeOriginOdometer4  : null,
          routeDestination4 : null,
          routeDestinationTime4 : null,
          routeDestinationOdometer4 : null,
          
          travelled1 : null,
          travelled2  : null,
          travelled3  : null,
          travelled4 : null,
          
          clients : null,
          totalOdometer : null,
          averageKm:null
      }
  

   /**  Insert the new record to the desired id*/

   const insertQuery = `INSERT INTO ${database} SET ?`;
   connection.query(insertQuery, newRecord, (error, results) => {
       if (error) {
           console.error('An error occurred while inserting the record:', error);
           return;
       }
       res.json({msg :'Data saved successfully'}); 
});
}

const registerUser = async (req, res)  =>{
    console.log(req.body)

    const { username, email, password } = req.body;
    const saltRounds = 10; // Number of salt rounds
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = { username, email, password: hashedPassword };

        connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
            if (err) {
                console.error('Error inserting user: ', err);
                res.status(500).json({ error: 'Registration failed' });
            } else {
                console.log('User registered successfully');
                res.status(200).json({ message: 'Registration successful' });
            }
        });
    } catch (err) {
        console.error('Error hashing password: ', err);
        res.status(500).json({ error: 'Registration failed' });
    }
}

module.exports ={
    getTransactionDetails,
    insertTransaction,
    // getTransactionNumberCurrent,
    getTransactionCurrent,
    getStartOfDay,
    insertStartTransaction,
    DRandISCurrent,
    getPumpReading,
    registerUser
}