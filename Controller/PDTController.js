const connection = require('../Database/connection');
const { poolConnect, pool, sql } = require('../Database/AXconnection');
let cachedData1 = [];
let cachedData2 = [];
let cachedData3 = [];
let ayh_random_check_data = [];
let b20_random_check_data = [];
let agc_random_check_data = [];
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

/**================================GET=============================== */
// Add this route to your Node.js backend
const get_Start_PC = async (req, res) => {


	const database = 'physical_count_transaction';

	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		res.status(200).json(results);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
};

const get_PC_Records = async (req, res) => {
	const database = 'physical_count';

	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		res.status(200).json(results);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}

};

/**Get Site and Warehouse */
const get_Site_Warehouse = async (req, res) => {


	const database = 'site_and_warhouse';

	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		res.status(200).json(results);
		// console.log(results)
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
};

const get_Site_Warehouse2 = async (req, res) => {


	const database = 'site_and_warhouse';

	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		res.status(200).json(results);
		// console.log(results)
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
};
/**===============================On Hand=================== */
/**Get On Hand */
const get_On_Hand = async (req, res) => {

	const database = 'physical_count_onhand';

	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		res.status(200).json(results);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
};
const get_on_hand_random_count = async (req, res) => {
	// console.log('get_on_hand_random_count mobile', req.query);
	const comp = req.query.TransCompany;
	const cb = req.query.ScannedCaseB;
	const conVal = req.query.concatVal;
	const sLoc = req.query.scannedLoc;
	const site = req.query.TransSite;
	poolConnect
		.then(() => {
			console.log('Connected to SQL Server');
			// Use the pool to create a new request
			const request = new sql.Request(pool);
			// Now, execute your query using the request
			request.query(`select a.dataareaid as COMP,a.ITEMID,REPLACE(REPLACE(c.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SERACHNAME,REPLACE(REPLACE(d.NAME,CHAR(13),','),CHAR(10),',') as NAME 
			,REPLACE(REPLACE(d.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,b.CONFIGID,b.INVENTSIZEID as SIZE,b.INVENTCOLORID as COLOR,b.INVENTSTYLEID as STYLE 
			,b.INVENTSERIALID as BARCODE,b.INVENTSITEID as SITE,b.INVENTLOCATIONID as WAREHOUSE,b.WMSLOCATIONID as LOCATION,FORMAT(sum(a.AVAILPHYSICAL),'######.00') as AVAIL_PHYSICAL 
			,FORMAT(sum(a.ORDERED),'######.00') as ORDERED_inTotal,FORMAT(sum(a.ONORDER),'######.00') as OnORder 
			,format(sum(a.POSTEDVALUE),'#########.00')as FIN_COST_AMOUNT,format(case when isnull(sum(a.POSTEDVALUE),0)=0 or sum(a.POSTEDQTY)=0 then 0 else (sum(a.POSTEDVALUE)/sum(a.POSTEDQTY)) end,'#########.00') as COSTPRICE,FORMAT(k.PRICE,'######.00') as PURCH_PRICE 
			,g.NAME as PROD_CATEGORY,i.NAME as ITEMGROUP,j.LASTUPDATE 
			from INVENTSUM a
			left join INventdim b on a.inventdimid=b.inventdimid
			LEFT JOIN Ecoresproduct c on a.ITEMID=c.DISPLAYPRODUCTNUMBER 
			left join ECORESPRODUCTTRANSLATION d on c.RECID=d.PRODUCT  
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='${comp}' ) e on a.itemid=e.ITEMID 
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='${comp}' ) k on a.itemid=k.ITEMID 
			left join ECORESPRODUCTCATEGORY f on c.RECID=f.PRODUCT and f.CATEGORY<>0  
			left join  EcoResCategory g on f.CATEGORY=g.RECID 
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='${comp}') h on a.itemid=h.ITEMID 
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='${comp}') i on h.ITEMGROUPID=i.ITEMGROUPID 
			left join (Select ITEMID,max(LASTUPDDATEPHYSICAL) as LASTUPDATE from INVENTSUM group by ITEMID) j on a.ITEMID=j.ITEMID 
			where AVAILPHYSICAL != 0 and a.DATAAREAID='${comp}' --and b.INVENTSITEID='BA'
			group by a.dataareaid,a.itemid,c.SEARCHNAME,d.NAME,d.DESCRIPTION,b.configid,b.INVENTSIZEID,b.INVENTCOLORID,b.INVENTSTYLEID,b.INVENTSERIALID,b.INVENTSITEID,b.INVENTLOCATIONID,b.WMSLOCATIONID,e.PRICE,k.PRICE,g.NAME,i.NAME,j.LASTUPDATE,d.DESCRIPTION,a.POSTEDVALUE 
			order by a.DATAAREAID,b.INVENTLOCATIONID,a.ITEMID`, (err, result) => {
				if (err) {
					console.error('Error:', err);
					return;
				}
				// console.log('result',result)
				if (result && result.recordset) {
					const recordsWithUniqueKey = result.recordset.map((rec) => {
						const uniquekey = `${rec.ITEMID}${rec.CONFIGID}${rec.SIZE}${rec.COLOR}${rec.STYLE}${rec.SITE}${rec.WAREHOUSE}${rec.LOCATION}`;
						const uniqueLoc = `${rec.SITE}${rec.WAREHOUSE}${rec.LOCATION}`;
						return {
							...rec,
							uniquekey,
							uniqueLoc, // Add the uniquekey property to the record
						};
					});
					const filteredRecordsPerSite = recordsWithUniqueKey.filter((record) => {
						return record.SITE === site;
					});
					const asdasdsad = filteredRecordsPerSite.filter((record) => {
						return record.BARCODE === cb && record.uniquekey.includes(conVal);
					});
					// console.log(asdasdsad)
					let filteredRecords = [];
					if (comp === 'ayh') {
						if (cb !== '' && cb !== 'null' && cb !== null) {
							filteredRecords = filteredRecordsPerSite.filter((record) => {
								return record.uniquekey.includes(conVal);
							});
							// console.log('with cb',filteredRecordsPerSite)
						} else {
							filteredRecords = filteredRecordsPerSite.filter((record) => {
								return record.uniqueLoc.includes(sLoc);
							});
							// console.log('without cb',filteredRecords)
						}
					} else if (comp === 'b20') {
						if (cb !== '' && cb !== 'null' && cb !== null) {
							filteredRecords = filteredRecordsPerSite.filter((record) => {
								return record.BARCODE === cb && record.uniquekey.includes(conVal);
							});
							// console.log('with cb',filteredRecordsPerSite)
						} else {
							filteredRecords = filteredRecordsPerSite.filter((record) => {
								return record.uniqueLoc.includes(sLoc);
							});
							// console.log('without cb',filteredRecords)
						}
					}

					if (filteredRecords.length > 0) {
						// console.log('without cb', filteredRecords)
						res.status(200).json(filteredRecords);
					}
					else {
						res.status(500).send('No matching records found');
					}
					// console.log('Filtered Records:', filteredRecords);
				}



				// console.log('Query result:', result.recordset);
			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
		});

}
/**===============================On Hand=================== */
/**Get item details based on scanned qr code */
const get_Item_Details = async (req, res) => {

	const database = 'item_masterfile';
	const database2 = 'variant_masterfile';
	const database3 = 'variant_masterfile_b20';
	const Case_barcode = req.query.Case_barcode;
	const Company = req.query.comp;
	// console.log('get_Item_Details mobile', Company);
	if (Company === 'ayh') {
		// Check cachedData1 first
		const cachedItem1 = cachedData1.find(item => item.ITEMCASEBARCODE === Case_barcode && item.Company === Company);
		const cachedItem2 = cachedData2.find(item => item.ITEMCASEBARCODE === Case_barcode && item.DATAAREAID === Company);
		if (cachedItem1) {
			res.status(200).json(cachedItem1);

		}

		// If not found in cachedData1, check cachedData2

		else if (cachedItem2) {
			res.status(200).json(cachedItem2);
			return; // Exit the function early if data is found in cachedData2
		}
		else {
			res.status(500).json({ err: 'No Data Retrieved.' });
		}

	} else if (Company === 'b20') {
		const cachedItem1 = cachedData1.find(item => item.ITEMCASEBARCODE === Case_barcode && item.Company === Company);
		const cachedItem2 = cachedData2.find(item => item.ITEMCASEBARCODE === Case_barcode && item.DATAAREAID === Company);
		const cachedItem3 = cachedData3.find(item => item.ITEMCASEBARCODE === Case_barcode && item.DATAAREAID === Company);
		if (cachedItem3) {
			res.status(200).json(cachedItem3);

		}
		// If not found in cachedData1, check cachedData2
		else if (cachedItem1) {
			res.status(200).json(cachedItem1);
			return; // Exit the function early if data is found in cachedData2
		}
		else if (cachedItem2) {
			res.status(200).json(cachedItem2);
			return; // Exit the function early if data is found in cachedData2
		}
		else {
			res.status(500).json({ err: 'No Data Retrieved.' });
		}
	}


	// try {
	// 	const query = `SELECT * FROM ${database} WHERE ITEMCASEBARODE = '${Case_barcode}'`;
	// 	const results = await executeQuery(query);
	// 	console.log(results)
	// 	if(results.length > 0){
	// 		res.status(200).json(results);
	// 	}else{
	// 		try {
	// 			const query2 = `SELECT * FROM ${database2} WHERE ITEMCASEBARCODE = '${Case_barcode}'`;
	// 			const result = await executeQuery(query2);

	// 			if(result.length > 0){
	// 				console.log(results)
	// 				res.status(200).json(result);
	// 			}else{
	// 				res.status(500).json({err: 'No Data Retrieved.'});
	// 			}
	// 		} catch (error) {
	// 			console.error('Error:', error);
	// 			res.status(500).send('An error occurred while retrieving the products from database2.');
	// 		}
	// 	}

	// } catch (error) {
	// 	console.error('Error:', error);
	// 	res.status(500).send('An error occurred while retrieving the products from database1.');
	// }

};
/**Get On Hand */
const get_Details = async (req, res) => {
	const database = 'item_masterfile';
	const database2 = 'variant_masterfile';
	const database3 = 'variant_masterfile_b20';
	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);

		cachedData1 = results;
		try {
			const query2 = `SELECT * FROM ${database2}`;
			const result = await executeQuery(query2);
			// console.log(results)
			cachedData2 = result;
			try {
				const query3 = `SELECT * FROM ${database3}`;
				const result3 = await executeQuery(query3);
				// console.log(results)
				cachedData3 = result3;
				const combinedData = {
					d1: results,
					d2: result,
					d3: result3
				};
				res.status(200).json(combinedData);
			} catch (error) {
				console.error('Error:', error);
				res.status(500).send('An error occurred while retrieving the products from database2.');
			}
		} catch (error) {
			console.error('Error:', error);
			res.status(500).send('An error occurred while retrieving the products from database2.');
		}
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products from database1.');
	}

};
/**Get Batch number */
const get_batch_number = async (req, res) => {

	const database = 'physical_count_batch_number';

	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		res.status(200).json(results);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
};

/**Get item group from ax*/
const get_ax_data = (req, res) => {
	// console.log(req.query)
	const comp = req.query.Comp;
	const site = req.query.site;

	// console.log(comp, site)
	poolConnect

		.then(() => {
			// console.log('Connected to SQL Server');
			const request = new sql.Request(pool);

			// Query 1
			request.query(`select a.dataareaid as COMP,a.ITEMID,REPLACE(REPLACE(c.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SERACHNAME,REPLACE(REPLACE(d.NAME,CHAR(13),','),CHAR(10),',') as NAME 
					,REPLACE(REPLACE(d.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,b.CONFIGID,b.INVENTSIZEID as SIZE,b.INVENTCOLORID as COLOR,b.INVENTSTYLEID as STYLE 
					,b.INVENTSERIALID as BARCODE,b.INVENTSITEID as SITE,b.INVENTLOCATIONID as WAREHOUSE,b.WMSLOCATIONID as LOCATION,FORMAT(sum(a.AVAILPHYSICAL),'######.00') as AVAIL_PHYSICAL 
					,FORMAT(sum(a.ORDERED),'######.00') as ORDERED_inTotal,FORMAT(sum(a.ONORDER),'######.00') as OnORder 
					,format(sum(a.POSTEDVALUE),'#########.00')as FIN_COST_AMOUNT,format(case when isnull(sum(a.POSTEDVALUE),0)=0 or sum(a.POSTEDQTY)=0 then 0 else (sum(a.POSTEDVALUE)/sum(a.POSTEDQTY)) end,'#########.00') as COSTPRICE,FORMAT(k.PRICE,'######.00') as PURCH_PRICE 
					,g.NAME as PROD_CATEGORY,i.NAME as ITEMGROUP,j.LASTUPDATE 
					from INVENTSUM a
					left join INventdim b on a.inventdimid=b.inventdimid
					LEFT JOIN Ecoresproduct c on a.ITEMID=c.DISPLAYPRODUCTNUMBER 
					left join ECORESPRODUCTTRANSLATION d on c.RECID=d.PRODUCT  
					Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='${comp}' ) e on a.itemid=e.ITEMID 
					Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='${comp}' ) k on a.itemid=k.ITEMID 
					left join ECORESPRODUCTCATEGORY f on c.RECID=f.PRODUCT and f.CATEGORY<>0  
					left join  EcoResCategory g on f.CATEGORY=g.RECID 
					LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='${comp}') h on a.itemid=h.ITEMID 
					left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='${comp}') i on h.ITEMGROUPID=i.ITEMGROUPID 
					left join (Select ITEMID,max(LASTUPDDATEPHYSICAL) as LASTUPDATE from INVENTSUM group by ITEMID) j on a.ITEMID=j.ITEMID 
					where AVAILPHYSICAL != 0 and a.DATAAREAID='${comp}' and b.INVENTSITEID = '${site}' --and b.INVENTSITEID='BA' 
					group by a.dataareaid,a.itemid,c.SEARCHNAME,d.NAME,d.DESCRIPTION,b.configid,b.INVENTSIZEID,b.INVENTCOLORID,b.INVENTSTYLEID,b.INVENTSERIALID,b.INVENTSITEID,b.INVENTLOCATIONID,b.WMSLOCATIONID,e.PRICE,k.PRICE,g.NAME,i.NAME,j.LASTUPDATE,d.DESCRIPTION,a.POSTEDVALUE 
					order by a.DATAAREAID,b.INVENTLOCATIONID,a.ITEMID`, (err1, result1) => {
				if (err1) {
					console.error('Error in Query 1:', err1);
					return res.status(500).json({ error: 'Database error in Query 1' });
				}

				//   console.log('success combinedResults', result1.recordset)
				// Create an empty Set to store unique ITEMGROUP values
				const uniqueItemGroups = new Set();

				// Iterate through the recordset to extract unique ITEMGROUP values
				result1.recordset.forEach((record) => {
					uniqueItemGroups.add(record.ITEMGROUP);
				});

				// Convert the Set to an array if needed
				const uniqueItemGroupsArray = Array.from(uniqueItemGroups);

				// Now, uniqueItemGroupsArray contains the unique ITEMGROUP values
				// console.log(uniqueItemGroupsArray);
				res.status(200).json(uniqueItemGroupsArray);

			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
			res.status(500).json({ error: 'Database connection error' });
		});
};

/**Get site location from ax MSSQL server*/
const get_site_warehouse_loc = (req, res) => {

	poolConnect
		.then(() => {
			// console.log('Connected to SQL Server');
			// Use the pool to create a new request
			const request = new sql.Request(pool);


			// Now, execute your query using the request
			request.query(`SELECT
			inventlocation.INVENTSITEID,
			inventlocation.INVENTLOCATIONID,
			inventlocation.NAME,
			inventlocation.DATAAREAID,
			inventlocation.RECID,
			WmsLocation.WMSLOCATIONID
		FROM
			inventlocation
		JOIN
			WmsLocation ON inventlocation.INVENTLOCATIONID = WmsLocation.INVENTLOCATIONID
						  AND inventlocation.DATAAREAID = WmsLocation.DATAAREAID
		ORDER BY
		inventlocation.DATAAREAID,
		inventlocation.INVENTSITEID;`, (err, result) => {
				if (err) {
					console.error('Error:', err);
					return;
				}
				const database = 'site_and_warhouse';
				const dataToInsert = result.recordset;
				// res.status(200).json(result.recordset);
				// console.log('Query result:', result.recordset);
				/**  delete the new record to the desired id*/
				const deleterQuery = `DELETE FROM ${database}`;
				connection.query(deleterQuery, (error, results) => {
					if (error) {
						console.error('An error occurred while inserting the record:', error);
						return;
					}

					connection.query(`ALTER TABLE ${database} AUTO_INCREMENT = 1;`, (error, results) => {
						if (error) {
							console.error('An error occurred while setting auto-increment back:', error);
							// res.status(500).send('Error enabling auto-increment');
						} else {
							console.log('Auto-increment set back on id column.');
							// res.status(200).send('Data deleted successfully');
						}
					});

					let values = [];
					let query = '';

					const placeholders = Array(dataToInsert.length).fill('(?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
					dataToInsert.forEach(item => {
						values.push(
							item.DATAAREAID, item.INVENTSITEID, item.INVENTLOCATIONID, item.WMSLOCATIONID, item.NAME, item.RECID
						);
					});

					query = `INSERT INTO ${database} (Company, Site, Warehouse,Location, Name, RecId, Created_at, Updated_at
        ) VALUES ${placeholders}`;
					// First, delete all data in the 'site_and_warehouse' table

					// console.log('Generated SQL query:', query);
					connection.query(query, values, (error, results) => {
						if (error) {
							console.error('An error occurred:', error);
							res.status(500).send('Error saving data');
						} else {
							res.status(200).send(`Data saved successfully`);
						}
					});
				});
			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
		});
};

/**Get item masterfile from ax MSSQL server*/
const get_item_masterfile = (req, res) => {

	poolConnect
		.then(() => {
			console.log('Connected to SQL Server');
			// Use the pool to create a new request
			const request = new sql.Request(pool);


			// Now, execute your query using the request
			request.query(`Select case when b.INSTANCERELATIONTYPE='3267' then 'Product Master' else 'Product' end as PRODUCT_SUBTYPE
			,case when b.PRODUCTTYPE=1 then 'Item' when b.PRODUCTTYPE=2 then 'Service' else '' end as PRODUCTTYPE
			,a.ITEMID,REPLACE(REPLACE(a.NAMEALIAS,CHAR(13),','),CHAR(10),',') as SEARCHNAME,REPLACE(REPLACE(c.NAME,CHAR(13),','),CHAR(10),',') as NAME,REPLACE(REPLACE(c.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION
			,upper(d.UNITID) as UNITID,e.TAXITEMGROUPID as PURCH_TAX_GROUP,f.TAXITEMGROUPID as SALE_TAX_GROUP,g.ITEMGROUPID,h.NAME as ITEMGROUP_NAME
			,FORMAT(d.PRICE,'#######0.0000') as MANAGE_COST, FORMAT(e.PRICE,'#######0.0000') as PURCH_PRICE, FORMAT(f.PRICE,'#######0.0000') as SALES_PRICE
			,i.DISPLAYVALUE as BUSINESSUNIT,j.DISPLAYVALUE as COSTCENTER,k.DISPLAYVALUE as DEPARTMENT,l.DISPLAYVALUE as SITE,m.DISPLAYVALUE as AYH_PRODUCTGROUP,n.DISPLAYVALUE as B20_PRODUCTGROUP,o.DISPLAYVALUE as TRUCK
			,b.MSB_PLATINUMITEMCODE as ITEMCASEBARODE,b.MSB_AXCONFIG as PRODUCTBARCODE
			from INVENTTABLE a
			left join ECORESPRODUCT b on a.PRODUCT=b.RECID
			left join ECORESPRODUCTTRANSLATION c on a.PRODUCT=c.PRODUCT
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='AYH' ) d on a.ITEMID=d.ITEMID
			Left join (select itemid,TAXITEMGROUPID,PRICE from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='AYH' ) e on a.ITEMID=e.ITEMID
			Left join (select itemid,TAXITEMGROUPID,PRICE from INVENTTABLEMODULE where MODULETYPE=2 and DATAAREAID='AYH' ) f on a.ITEMID=f.ITEMID
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='AYH') g on a.ITEMID=g.ITEMID  
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='AYH') h on g.ITEMGROUPID=h.ITEMGROUPID 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145326') i on a.DEFAULTDIMENSION = i.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145327') j on a.DEFAULTDIMENSION = j.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145328') k on a.DEFAULTDIMENSION = k.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145329') l on a.DEFAULTDIMENSION = l.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145330') m on a.DEFAULTDIMENSION = m.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145331') n on a.DEFAULTDIMENSION = n.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145332') o on a.DEFAULTDIMENSION = o.DIMENSIONATTRIBUTEVALUESET
			where a.dataareaid='AYH' 
			Order by a.ITEMID;`, (err, result) => {
				if (err) {
					console.error('Error:', err);
					return;
				}

				// Now, execute your query using the request
				request.query(`Select case when b.INSTANCERELATIONTYPE='3267' then 'Product Master' else 'Product' end as PRODUCT_SUBTYPE
			,case when b.PRODUCTTYPE=1 then 'Item' when b.PRODUCTTYPE=2 then 'Service' else '' end as PRODUCTTYPE
			,a.ITEMID,REPLACE(REPLACE(a.NAMEALIAS,CHAR(13),','),CHAR(10),',') as SEARCHNAME,REPLACE(REPLACE(c.NAME,CHAR(13),','),CHAR(10),',') as NAME,REPLACE(REPLACE(c.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION
			,upper(d.UNITID) as UNITID,e.TAXITEMGROUPID as PURCH_TAX_GROUP,f.TAXITEMGROUPID as SALE_TAX_GROUP,g.ITEMGROUPID,h.NAME as ITEMGROUP_NAME
			,FORMAT(d.PRICE,'#######0.0000') as MANAGE_COST, FORMAT(e.PRICE,'#######0.0000') as PURCH_PRICE, FORMAT(f.PRICE,'#######0.0000') as SALES_PRICE
			,i.DISPLAYVALUE as BUSINESSUNIT,j.DISPLAYVALUE as COSTCENTER,k.DISPLAYVALUE as DEPARTMENT,l.DISPLAYVALUE as SITE,m.DISPLAYVALUE as AYH_PRODUCTGROUP,n.DISPLAYVALUE as B20_PRODUCTGROUP,o.DISPLAYVALUE as TRUCK
			,b.MSB_PLATINUMITEMCODE as ITEMCASEBARODE,b.MSB_AXCONFIG as PRODUCTBARCODE
			from INVENTTABLE a
			left join ECORESPRODUCT b on a.PRODUCT=b.RECID
			left join ECORESPRODUCTTRANSLATION c on a.PRODUCT=c.PRODUCT
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='AYH' ) d on a.ITEMID=d.ITEMID
			Left join (select itemid,TAXITEMGROUPID,PRICE from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='AYH' ) e on a.ITEMID=e.ITEMID
			Left join (select itemid,TAXITEMGROUPID,PRICE from INVENTTABLEMODULE where MODULETYPE=2 and DATAAREAID='AYH' ) f on a.ITEMID=f.ITEMID
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='AYH') g on a.ITEMID=g.ITEMID  
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='AYH') h on g.ITEMGROUPID=h.ITEMGROUPID 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145326') i on a.DEFAULTDIMENSION = i.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145327') j on a.DEFAULTDIMENSION = j.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145328') k on a.DEFAULTDIMENSION = k.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145329') l on a.DEFAULTDIMENSION = l.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145330') m on a.DEFAULTDIMENSION = m.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145331') n on a.DEFAULTDIMENSION = n.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145332') o on a.DEFAULTDIMENSION = o.DIMENSIONATTRIBUTEVALUESET
			where a.dataareaid='b20' 
			Order by a.ITEMID;`, (err, result2) => {
					if (err) {
						console.error('Error:', err);
						return;
					}
					request.query(`Select case when b.INSTANCERELATIONTYPE='3267' then 'Product Master' else 'Product' end as PRODUCT_SUBTYPE
			,case when b.PRODUCTTYPE=1 then 'Item' when b.PRODUCTTYPE=2 then 'Service' else '' end as PRODUCTTYPE
			,a.ITEMID,REPLACE(REPLACE(a.NAMEALIAS,CHAR(13),','),CHAR(10),',') as SEARCHNAME,REPLACE(REPLACE(c.NAME,CHAR(13),','),CHAR(10),',') as NAME,REPLACE(REPLACE(c.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION
			,upper(d.UNITID) as UNITID,e.TAXITEMGROUPID as PURCH_TAX_GROUP,f.TAXITEMGROUPID as SALE_TAX_GROUP,g.ITEMGROUPID,h.NAME as ITEMGROUP_NAME
			,FORMAT(d.PRICE,'#######0.0000') as MANAGE_COST, FORMAT(e.PRICE,'#######0.0000') as PURCH_PRICE, FORMAT(f.PRICE,'#######0.0000') as SALES_PRICE
			,i.DISPLAYVALUE as BUSINESSUNIT,j.DISPLAYVALUE as COSTCENTER,k.DISPLAYVALUE as DEPARTMENT,l.DISPLAYVALUE as SITE,m.DISPLAYVALUE as AYH_PRODUCTGROUP,n.DISPLAYVALUE as B20_PRODUCTGROUP,o.DISPLAYVALUE as TRUCK
			,b.MSB_PLATINUMITEMCODE as ITEMCASEBARODE,b.MSB_AXCONFIG as PRODUCTBARCODE
			from INVENTTABLE a
			left join ECORESPRODUCT b on a.PRODUCT=b.RECID
			left join ECORESPRODUCTTRANSLATION c on a.PRODUCT=c.PRODUCT
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='AYH' ) d on a.ITEMID=d.ITEMID
			Left join (select itemid,TAXITEMGROUPID,PRICE from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='AYH' ) e on a.ITEMID=e.ITEMID
			Left join (select itemid,TAXITEMGROUPID,PRICE from INVENTTABLEMODULE where MODULETYPE=2 and DATAAREAID='AYH' ) f on a.ITEMID=f.ITEMID
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='AYH') g on a.ITEMID=g.ITEMID  
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='AYH') h on g.ITEMGROUPID=h.ITEMGROUPID 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145326') i on a.DEFAULTDIMENSION = i.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145327') j on a.DEFAULTDIMENSION = j.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145328') k on a.DEFAULTDIMENSION = k.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145329') l on a.DEFAULTDIMENSION = l.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145330') m on a.DEFAULTDIMENSION = m.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145331') n on a.DEFAULTDIMENSION = n.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145332') o on a.DEFAULTDIMENSION = o.DIMENSIONATTRIBUTEVALUESET
			where a.dataareaid='agc' 
			Order by a.ITEMID;`, (err, result3) => {
						if (err) {
							console.error('Error:', err);
							return;
						}
						const database = 'item_masterfile';
						const rec1 = result.recordset;
						const rec2 = result2.recordset;
						const rec3 = result3.recordset;

						const rec1WithCompany = rec1.map(item => {
							return { ...item, Company: 'ayh' };
						});
						const rec2WithCompany = rec2.map(item => {
							return { ...item, Company: 'b20' };
						});
						const rec3WithCompany = rec3.map(item => {
							return { ...item, Company: 'agc' };
						});
						const dataToInsert = [...rec1WithCompany, ...rec2WithCompany, ...rec3WithCompany];


						// Filter and modify the data
						const newData2 = dataToInsert.map(item => {
							if (item.ITEMCASEBARODE && item.ITEMCASEBARODE.startsWith('0')) {
								// Remove the leading '0' from ITEMCASEBARODE
								item.ITEMCASEBARODE = item.ITEMCASEBARODE.slice(1);
							}
							return item; // Include the item in the newData
						});
						// res.status(200).json(result.recordset);
						// console.log('Query result:', result.recordset);
						/**  delete the new record to the desired id*/
						const deleterQuery = `DELETE FROM ${database}`;
						connection.query(deleterQuery, (error, results) => {
							if (error) {
								console.error('An error occurred while inserting the record:', error);
								return;
							}

							connection.query(`ALTER TABLE ${database} AUTO_INCREMENT = 1;`, (error, results) => {
								if (error) {
									console.error('An error occurred while setting auto-increment back:', error);
									// res.status(500).send('Error enabling auto-increment');
								} else {
									console.log('Auto-increment set back on id column.');
									// res.status(200).send('Data deleted successfully');
								}
							});

							let values = [];
							let query = '';
							/**New update 11-15-2023 */
							const newData4 = newData2.map(item => {
								// C1heck if ITEMCASEBARCODE is null or an empty string
								if (item.ITEMCASEBARODE === null || item.ITEMCASEBARODE === '') {
									// Concatenate multiple properties and set it as ITEMCASEBARCODE
									return {
										...item,
										ITEMCASEBARODE: item.ITEMID,
									};
								} else {
									// If false, return the original record
									return item;
								}
							});

							// console.log(newData4[1])
							/**New update 11-15-2023 */
							const placeholders = Array(newData4.length).fill('(?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
							newData4.forEach(item => {

								values.push(
									item.Company, item.PRODUCT_SUBTYPE, item.PRODUCTTYPE, item.ITEMID, item.SEARCHNAME, item.NAME, item.DESCRIPTION, item.UNITID, item.PURCH_TAX_GROUP, item.SALE_TAX_GROUP, item.ITEMGROUPID,
									item.ITEMGROUP_NAME, item.MANAGE_COST, item.PURCH_PRICE, item.SALES_PRICE, item.BUSINESSUNIT, item.COSTCENTER, item.DEPARTMENT, item.SITE, item.AYH_PRODUCTGROUP, item.B20_PRODUCTGROUP,
									item.TRUCK, item.ITEMCASEBARODE, item.PRODUCTBARCODE
								);
							});

							query = `INSERT INTO ${database} (Company, PRODUCT_SUBTYPE, PRODUCTTYPE, ITEMID, SEARCHNAME, NAME, DESCRIPTION, UNITID, PURCH_TAX_GROUP, SALE_TAX_GROUP, ITEMGROUPID, 
					ITEMGROUP_NAME, MANAGE_COST, PURCH_PRICE, SALES_PRICE, BUSINESSUNIT, COSTCENTER, DEPARTMENT, SITE, AYH_PRODUCTGROUP, B20_PRODUCTGROUP,
					TRUCK, ITEMCASEBARCODE, PRODUCTBARCODE, Created_at, Updated_at
        ) VALUES ${placeholders}`;
							// First, delete all data in the 'site_and_warehouse' table

							// console.log('Generated SQL query:', query);
							connection.query(query, values, (error, results) => {
								if (error) {
									console.error('An error occurred:', error);
									res.status(500).send('Error saving data');
								} else {
									res.status(200).send(`Data saved successfully`);
								}
							});
						});
					});
				});
			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
		});
};

/**Get variants masterfile from ax MSSQL server*/
const get_variants_masterfile = (req, res) => {

	poolConnect
		.then(() => {
			console.log('Connected to SQL Server');
			// Use the pool to create a new request
			const request = new sql.Request(pool);


			// Now, execute your query using the request
			request.query(`SELECT
			a.ITEMID,
			a.NAMEALIAS AS SEARCHNAME,
			b.NAME AS ITEMNAME,
			b.DESCRIPTION,
			g.UNITID AS UNITID,
			h.ITEMGROUPID AS ITEMGROUPID,
			j.NAME AS ITEMGROUP_NAME,  -- Include ITEMGROUP_NAME
			e.CONFIGID AS CONFIG,
			e.INVENTSTYLEID AS [STYLE],
			e.INVENTCOLORID AS [COLOR],
			e.INVENTSIZEID AS [SIZE],
			'' AS PRODUCTBARCODE,
			'' AS CASEBARCODE,
			i.DESCRIPTION AS DESCRIPTION1,
			d.INVENTDIMID,
			i.PRODUCT,
			a.PRODUCT AS PRODUCTMASTER,
			a.DATAAREAID,
			a.RECID,
			f.MSB_PLATINUMITEMCODE AS ITEMCASEBARCODE,
			f.MSB_AXCONFIG AS PRODUCTBARCODE
		FROM INVENTTABLE a
		LEFT JOIN ECORESPRODUCTTRANSLATION b ON a.PRODUCT = b.PRODUCT
		LEFT JOIN InventTableModule g ON a.ITEMID = g.ITEMID AND a.DATAAREAID = g.DATAAREAID AND g.MODULETYPE = 1
		LEFT JOIN InventItemGroupItem h ON a.ITEMID = h.ITEMID AND a.DATAAREAID = h.ITEMDATAAREAID
		LEFT JOIN B2H_ECORESDISTINCTPRODUCTVARIANTS c ON a.PRODUCT = c.PRODUCTMASTER
		LEFT JOIN INVENTDIMCOMBINATION d ON c.RECID = d.DISTINCTPRODUCTVARIANT AND a.DATAAREAID = d.DATAAREAID
		LEFT JOIN INVENTDIM e ON d.INVENTDIMID = e.INVENTDIMID AND d.DATAAREAID = e.DATAAREAID
		LEFT JOIN ECORESPRODUCT f ON c.RECID1 = f.RECID
		LEFT JOIN ECORESPRODUCTTRANSLATION i ON f.RECID = i.PRODUCT
		left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='AYH') j on h.ITEMGROUPID=j.ITEMGROUPID   --newly added query table
		--LEFT JOIN INVENTITEMGROUP j ON h.ITEMGROUPID = j.ITEMGROUPID  -- New JOIN
		WHERE ISNULL(d.INVENTDIMID, '') <> ''
		ORDER BY a.ITEMID`, (err, result) => {
				if (err) {
					console.error('Error:', err);
					return;
				}
				request.query(`select a.ITEMID,REPLACE(REPLACE(c.NAME,CHAR(13),','),CHAR(10),',') as PRODUCTNAME,REPLACE(REPLACE(b.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SEARCHNAME
			,case when b.PRODUCTTYPE=1 then 'Item' else 'Service' end as ITEMTYPE,e.NAME as ITEM_MODEL_GROUP,g.NAME as ITEM_GROUP
			,case when b.InstancerelationType=3265 then 'Product' else 'Product Master' end as PRODUCT_SUBTYPE,i.NAME as PRODUCT_DIM_GROUP,k.NAME as STORAGE_DIM_GROUP
			,m.NAME as TRACKING_DIM_GROUP,aa.UNITID as PURCH_UOM,Format(aa.OVERDELIVERYPCT,'###.00') as OVERDELIVERY_PCT,Format(aa.UNDERDELIVERYPCT,'###.00') as UNDERDELIVERY_PCT
			,case when a.PURCHMODEL=1 then 'YES' else 'NO' end LATEST_PURCH_PRICE,aa.TAXITEMGROUPID as ITEM_SALESTAX_GROUP
			,bb.UNITID as INVENT_UOM,a.PDSSHELFLIFE as SHELF_LIFE,'' as LEAD_TIME,'' as SAFETY_STOCK,aa.PRICE as LATEST_PURCH_PRICE,'' as WAREHOUSE, '' as COLOR, '' as SIZE
			,dd.NAME as PROD_CATEGORY,REPLACE(REPLACE(c.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,f.ITEMGROUPID
			,ii.DISPLAYVALUE as BUSINESSUNIT,jj.DISPLAYVALUE as COSTCENTER,kk.DISPLAYVALUE as DEPARTMENT,ll.DISPLAYVALUE as SITE,mm.DISPLAYVALUE as AYH_PRODUCTGROUP,nn.DISPLAYVALUE as B20_PRODUCTGROUP,oo.DISPLAYVALUE as TRUCK
			,a.MODIFIEDDATETIME,a.MODIFIEDBY
			from INVENTTABLE a
			left join ECORESPRODUCT b on a.ITEMID=b.DISPLAYPRODUCTNUMBER
			left join ECORESPRODUCTTRANSLATION c on b.RECID=c.PRODUCT
			left join INVENTMODELGROUPITEM d on a.ITEMID=d.ITEMID and a.DATAAREAID=d.MODELGROUPDATAAREAID
			left join INVENTMODELGROUP e on d.MODELGROUPID=e.MODELGROUPID and d.MODELGROUPDATAAREAID=e.DATAAREAID
			left join INVENTITEMGROUPITEM f on a.ITEMID=f.ITEMID and a.DATAAREAID=f.ITEMGROUPDATAAREAID
			left join INVENTITEMGROUP g on f.ITEMGROUPID=g.ITEMGROUPID and f.ITEMGROUPDATAAREAID=g.DATAAREAID
			left join ECORESPRODUCTDIMENSIONGROUPPRODUCT h on b.RECID=h.PRODUCT
			left join ECORESPRODUCTDIMENSIONGROUP i on h.PRODUCTDIMENSIONGROUP=i.RECID
			left join ECORESSTORAGEDIMENSIONGROUPITEM j on a.ITEMID=j.ITEMID and a.DATAAREAID=j.ITEMDATAAREAID
			left join ECORESSTORAGEDIMENSIONGROUP k on j.STORAGEDIMENSIONGROUP=k.RECID
			left join ECORESTRACKINGDIMENSIONGROUPITEM l on a.ITEMID=l.ITEMID and a.DATAAREAID=l.ITEMDATAAREAID
			left join ECORESTRACKINGDIMENSIONGROUP m on l.TRACKINGDIMENSIONGROUP=m.RECID
			left join INVENTTABLEMODULE aa on a.ITEMID=aa.ITEMID and a.DATAAREAID=aa.DATAAREAID and aa.MODULETYPE=1
			left join INVENTTABLEMODULE bb on a.ITEMID=bb.ITEMID and a.DATAAREAID=bb.DATAAREAID and bb.MODULETYPE=0
			left join ECORESPRODUCTCATEGORY cc on b.RECID=cc.PRODUCT and cc.CATEGORY<>0
			left join ECORESCATEGORY dd on cc.CATEGORY=dd.RECID
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145326') ii on a.DEFAULTDIMENSION = ii.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145327') jj on a.DEFAULTDIMENSION = jj.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145328') kk on a.DEFAULTDIMENSION = kk.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145329') ll on a.DEFAULTDIMENSION = ll.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145330') mm on a.DEFAULTDIMENSION = mm.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145331') nn on a.DEFAULTDIMENSION = nn.DIMENSIONATTRIBUTEVALUESET 
			left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
					FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
					left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
					left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
					where cc.RECID = '5637145332') oo on a.DEFAULTDIMENSION = oo.DIMENSIONATTRIBUTEVALUESET
			
			where a.DATAAREAID='AYH' and f.ITEMGROUPID like'FG%'
			--and b.SEARCHNAME like '(DO NOT USE)%'
			order by a.MODIFIEDDATETIME,a.ITEMID;`, (err1, result1) => {
					if (err1) {
						console.error('Error in Query 1:', err1);
						return res.status(500).json({ error: 'Database error in Query 1' });
					}

					request.query(`select a.ITEMID,REPLACE(REPLACE(c.NAME,CHAR(13),','),CHAR(10),',') as PRODUCTNAME,REPLACE(REPLACE(b.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SEARCHNAME
				,case when b.PRODUCTTYPE=1 then 'Item' else 'Service' end as ITEMTYPE,e.NAME as ITEM_MODEL_GROUP,g.NAME as ITEM_GROUP
				,case when b.InstancerelationType=3265 then 'Product' else 'Product Master' end as PRODUCT_SUBTYPE,i.NAME as PRODUCT_DIM_GROUP,k.NAME as STORAGE_DIM_GROUP
				,m.NAME as TRACKING_DIM_GROUP,aa.UNITID as PURCH_UOM,Format(aa.OVERDELIVERYPCT,'###.00') as OVERDELIVERY_PCT,Format(aa.UNDERDELIVERYPCT,'###.00') as UNDERDELIVERY_PCT
				,case when a.PURCHMODEL=1 then 'YES' else 'NO' end LATEST_PURCH_PRICE,aa.TAXITEMGROUPID as ITEM_SALESTAX_GROUP
				,bb.UNITID as INVENT_UOM,a.PDSSHELFLIFE as SHELF_LIFE,'' as LEAD_TIME,'' as SAFETY_STOCK,aa.PRICE as LATEST_PURCH_PRICE,'' as WAREHOUSE, '' as COLOR, '' as SIZE
				,dd.NAME as PROD_CATEGORY,REPLACE(REPLACE(c.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,f.ITEMGROUPID
				,ii.DISPLAYVALUE as BUSINESSUNIT,jj.DISPLAYVALUE as COSTCENTER,kk.DISPLAYVALUE as DEPARTMENT,ll.DISPLAYVALUE as SITE,mm.DISPLAYVALUE as AYH_PRODUCTGROUP,nn.DISPLAYVALUE as B20_PRODUCTGROUP,oo.DISPLAYVALUE as TRUCK
				,a.MODIFIEDDATETIME,a.MODIFIEDBY
				from INVENTTABLE a
				left join ECORESPRODUCT b on a.ITEMID=b.DISPLAYPRODUCTNUMBER
				left join ECORESPRODUCTTRANSLATION c on b.RECID=c.PRODUCT
				left join INVENTMODELGROUPITEM d on a.ITEMID=d.ITEMID and a.DATAAREAID=d.MODELGROUPDATAAREAID
				left join INVENTMODELGROUP e on d.MODELGROUPID=e.MODELGROUPID and d.MODELGROUPDATAAREAID=e.DATAAREAID
				left join INVENTITEMGROUPITEM f on a.ITEMID=f.ITEMID and a.DATAAREAID=f.ITEMGROUPDATAAREAID
				left join INVENTITEMGROUP g on f.ITEMGROUPID=g.ITEMGROUPID and f.ITEMGROUPDATAAREAID=g.DATAAREAID
				left join ECORESPRODUCTDIMENSIONGROUPPRODUCT h on b.RECID=h.PRODUCT
				left join ECORESPRODUCTDIMENSIONGROUP i on h.PRODUCTDIMENSIONGROUP=i.RECID
				left join ECORESSTORAGEDIMENSIONGROUPITEM j on a.ITEMID=j.ITEMID and a.DATAAREAID=j.ITEMDATAAREAID
				left join ECORESSTORAGEDIMENSIONGROUP k on j.STORAGEDIMENSIONGROUP=k.RECID
				left join ECORESTRACKINGDIMENSIONGROUPITEM l on a.ITEMID=l.ITEMID and a.DATAAREAID=l.ITEMDATAAREAID
				left join ECORESTRACKINGDIMENSIONGROUP m on l.TRACKINGDIMENSIONGROUP=m.RECID
				left join INVENTTABLEMODULE aa on a.ITEMID=aa.ITEMID and a.DATAAREAID=aa.DATAAREAID and aa.MODULETYPE=1
				left join INVENTTABLEMODULE bb on a.ITEMID=bb.ITEMID and a.DATAAREAID=bb.DATAAREAID and bb.MODULETYPE=0
				left join ECORESPRODUCTCATEGORY cc on b.RECID=cc.PRODUCT and cc.CATEGORY<>0
				left join ECORESCATEGORY dd on cc.CATEGORY=dd.RECID
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145326') ii on a.DEFAULTDIMENSION = ii.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145327') jj on a.DEFAULTDIMENSION = jj.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145328') kk on a.DEFAULTDIMENSION = kk.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145329') ll on a.DEFAULTDIMENSION = ll.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145330') mm on a.DEFAULTDIMENSION = mm.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145331') nn on a.DEFAULTDIMENSION = nn.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145332') oo on a.DEFAULTDIMENSION = oo.DIMENSIONATTRIBUTEVALUESET
				
				where a.DATAAREAID='b20' and f.ITEMGROUPID like'FG%'
				--and b.SEARCHNAME like '(DO NOT USE)%'
				order by a.MODIFIEDDATETIME,a.ITEMID;`, (err2, result2) => {
						if (err2) {
							console.error('Error in Query 1:', err2);
							return res.status(500).json({ error: 'Database error in Query 1' });
						}


						request.query(`select a.ITEMID,REPLACE(REPLACE(c.NAME,CHAR(13),','),CHAR(10),',') as PRODUCTNAME,REPLACE(REPLACE(b.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SEARCHNAME
				,case when b.PRODUCTTYPE=1 then 'Item' else 'Service' end as ITEMTYPE,e.NAME as ITEM_MODEL_GROUP,g.NAME as ITEM_GROUP
				,case when b.InstancerelationType=3265 then 'Product' else 'Product Master' end as PRODUCT_SUBTYPE,i.NAME as PRODUCT_DIM_GROUP,k.NAME as STORAGE_DIM_GROUP
				,m.NAME as TRACKING_DIM_GROUP,aa.UNITID as PURCH_UOM,Format(aa.OVERDELIVERYPCT,'###.00') as OVERDELIVERY_PCT,Format(aa.UNDERDELIVERYPCT,'###.00') as UNDERDELIVERY_PCT
				,case when a.PURCHMODEL=1 then 'YES' else 'NO' end LATEST_PURCH_PRICE,aa.TAXITEMGROUPID as ITEM_SALESTAX_GROUP
				,bb.UNITID as INVENT_UOM,a.PDSSHELFLIFE as SHELF_LIFE,'' as LEAD_TIME,'' as SAFETY_STOCK,aa.PRICE as LATEST_PURCH_PRICE,'' as WAREHOUSE, '' as COLOR, '' as SIZE
				,dd.NAME as PROD_CATEGORY,REPLACE(REPLACE(c.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,f.ITEMGROUPID
				,ii.DISPLAYVALUE as BUSINESSUNIT,jj.DISPLAYVALUE as COSTCENTER,kk.DISPLAYVALUE as DEPARTMENT,ll.DISPLAYVALUE as SITE,mm.DISPLAYVALUE as AYH_PRODUCTGROUP,nn.DISPLAYVALUE as B20_PRODUCTGROUP,oo.DISPLAYVALUE as TRUCK
				,a.MODIFIEDDATETIME,a.MODIFIEDBY
				from INVENTTABLE a
				left join ECORESPRODUCT b on a.ITEMID=b.DISPLAYPRODUCTNUMBER
				left join ECORESPRODUCTTRANSLATION c on b.RECID=c.PRODUCT
				left join INVENTMODELGROUPITEM d on a.ITEMID=d.ITEMID and a.DATAAREAID=d.MODELGROUPDATAAREAID
				left join INVENTMODELGROUP e on d.MODELGROUPID=e.MODELGROUPID and d.MODELGROUPDATAAREAID=e.DATAAREAID
				left join INVENTITEMGROUPITEM f on a.ITEMID=f.ITEMID and a.DATAAREAID=f.ITEMGROUPDATAAREAID
				left join INVENTITEMGROUP g on f.ITEMGROUPID=g.ITEMGROUPID and f.ITEMGROUPDATAAREAID=g.DATAAREAID
				left join ECORESPRODUCTDIMENSIONGROUPPRODUCT h on b.RECID=h.PRODUCT
				left join ECORESPRODUCTDIMENSIONGROUP i on h.PRODUCTDIMENSIONGROUP=i.RECID
				left join ECORESSTORAGEDIMENSIONGROUPITEM j on a.ITEMID=j.ITEMID and a.DATAAREAID=j.ITEMDATAAREAID
				left join ECORESSTORAGEDIMENSIONGROUP k on j.STORAGEDIMENSIONGROUP=k.RECID
				left join ECORESTRACKINGDIMENSIONGROUPITEM l on a.ITEMID=l.ITEMID and a.DATAAREAID=l.ITEMDATAAREAID
				left join ECORESTRACKINGDIMENSIONGROUP m on l.TRACKINGDIMENSIONGROUP=m.RECID
				left join INVENTTABLEMODULE aa on a.ITEMID=aa.ITEMID and a.DATAAREAID=aa.DATAAREAID and aa.MODULETYPE=1
				left join INVENTTABLEMODULE bb on a.ITEMID=bb.ITEMID and a.DATAAREAID=bb.DATAAREAID and bb.MODULETYPE=0
				left join ECORESPRODUCTCATEGORY cc on b.RECID=cc.PRODUCT and cc.CATEGORY<>0
				left join ECORESCATEGORY dd on cc.CATEGORY=dd.RECID
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145326') ii on a.DEFAULTDIMENSION = ii.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145327') jj on a.DEFAULTDIMENSION = jj.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145328') kk on a.DEFAULTDIMENSION = kk.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145329') ll on a.DEFAULTDIMENSION = ll.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145330') mm on a.DEFAULTDIMENSION = mm.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145331') nn on a.DEFAULTDIMENSION = nn.DIMENSIONATTRIBUTEVALUESET 
				left join (select aa.DIMENSIONATTRIBUTEVALUESET, aa.DIMENSIONATTRIBUTEVALUE, bb.RECID, cc.NAME, aa.DISPLAYVALUE 
						FROM DIMENSIONATTRIBUTEVALUESETITEM aa 
						left join DIMENSIONATTRIBUTEVALUE bb on aa.DIMENSIONATTRIBUTEVALUE = bb.RECID 
						left join DIMENSIONATTRIBUTE cc on bb.DIMENSIONATTRIBUTE = cc.RECID 
						where cc.RECID = '5637145332') oo on a.DEFAULTDIMENSION = oo.DIMENSIONATTRIBUTEVALUESET
				
				where a.DATAAREAID='agc' and f.ITEMGROUPID like'FG%'
				--and b.SEARCHNAME like '(DO NOT USE)%'
				order by a.MODIFIEDDATETIME,a.ITEMID;`, (err3, result3) => {
							if (err3) {
								console.error('Error in Query 1:', err3);
								return res.status(500).json({ error: 'Database error in Query 1' });
							}
							const FimDin = [...result1.recordset, ...result2.recordset, ...result3.recordset]

							const database = 'variant_masterfile';
							const recordSets = result.recordset;

							// Sample dataToInsert and findim arrays


							// Function to add properties to dataToInsert with null values if no match
							function enrichDataToInsert(dataToInsert, findim) {
								return dataToInsert.map(item => {
									const match = findim.find(findimItem => findimItem.ITEMID === item.ITEMID);

									if (match) {
										return {
											...item,
											BUSINESSUNIT: match.BUSINESSUNIT,
											COSTCENTER: match.COSTCENTER,
											DEPARTMENT: match.DEPARTMENT,
											SITE: match.SITE,
											AYH_PRODUCTGROUP: match.AYH_PRODUCTGROUP,
											B20_PRODUCTGROUP: match.B20_PRODUCTGROUP
										};
									} else {
										return {
											...item,
											BUSINESSUNIT: null,
											COSTCENTER: null,
											DEPARTMENT: null,
											SITE: null,
											AYH_PRODUCTGROUP: null,
											B20_PRODUCTGROUP: null
										};
									}
								});
							}

							const dataToInsert = enrichDataToInsert(recordSets, FimDin);

							// console.log(dataToInsert);





							// const dataToInsert = result.recordset;
							// console.log('FimDin',FimDin.length)




							const newData3 = dataToInsert.map(item => {
								const description = item.DESCRIPTION ? item.DESCRIPTION : item.ITEMNAME;

								// Create a new object with the updated UNIQUE_DESC property
								const UNIQUE_DESC = `${description} ${item.CONFIG} ${item.SIZE} ${item.COLOR} ${item.STYLE}`;

								// Create a new object with the additional property
								return {
									...item, // Spread the original object's properties
									UNIQUE_DESC: UNIQUE_DESC // Add the new property
								};
							});
							const newData2 = newData3.map(item => {
								if (item.ITEMCASEBARCODE && item.ITEMCASEBARCODE.startsWith('0')) {
									// Remove the leading '0' from ITEMCASEBARODE
									item.ITEMCASEBARCODE = item.ITEMCASEBARCODE.slice(1);
								}
								return item; // Include the item in the newData
							});
							// res.status(200).json(result.recordset);

							// 				 /**  delete the new record to the desired id*/
							const deleterQuery = `DELETE FROM ${database}`;
							connection.query(deleterQuery, (error, results) => {
								if (error) {
									console.error('An error occurred while inserting the record:', error);
									return;
								}

								connection.query(`ALTER TABLE ${database} AUTO_INCREMENT = 1;`, (error, results) => {
									if (error) {
										console.error('An error occurred while setting auto-increment back:', error);
										// res.status(500).send('Error enabling auto-increment');
									} else {
										console.log('Auto-increment set back on id column.');
										// res.status(200).send('Data deleted successfully');
									}
								});

								let values = [];
								let query = '';
								/**New update 11-15-2023 */
								const newData = newData2.map(item => {
									// Check if ITEMCASEBARCODE is null or an empty string
									if (item.ITEMCASEBARCODE === null || item.ITEMCASEBARCODE === '') {
										// Concatenate multiple properties and set it as ITEMCASEBARCODE
										return {
											...item,
											ITEMCASEBARCODE: item.ITEMID + item.CONFIG + item.SIZE + item.COLOR + item.STYLE,
										};
									} else {
										// If false, return the original record
										return item;
									}
								});
								/**New update 11-15-2023 */
								const placeholders = Array(newData.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
								newData.forEach(item => {

									values.push(
										item.ITEMID, item.SEARCHNAME, item.ITEMNAME, item.DESCRIPTION, item.UNITID, item.ITEMGROUPID, item.ITEMGROUP_NAME, item.CONFIG, item.STYLE, item.COLOR, item.SIZE,
										item.BUSINESSUNIT, item.COSTCENTER, item.DEPARTMENT, item.SITE, item.AYH_PRODUCTGROUP, item.B20_PRODUCTGROUP,
										item.UNIQUE_DESC, null, item.CASEBARCODE, item.DESCRIPTION1, item.INVENTDIMID, item.PRODUCT, item.PRODUCTMASTER,
										item.DATAAREAID, item.RECID, item.ITEMCASEBARCODE
									);
								});

								query = `INSERT INTO ${database} (ITEMID, SEARCHNAME, ITEMNAME, DESCRIPTION, UNITID, ITEMGROUPID, ITEMGROUP_NAME, CONFIG, STYLE, COLOR, SIZE,
						BUSINESSUNIT, COSTCENTER, DEPARTMENT, SITE, AYH_PRODUCTGROUP, B20_PRODUCTGROUP,
					UNIQUE_DESC, PRODUCTBARCODE, CASEBARCODE, DESCRIPTION1, INVENTDIMID, PRODUCT, PRODUCTMASTER, 
					DATAAREAID, RECID, ITEMCASEBARCODE, Created_At, Updated_At) VALUES ${placeholders}`;
								// First, delete all data in the 'site_and_warehouse' table

								// console.log('Generated SQL query:', query);
								connection.query(query, values, (error, results) => {
									if (error) {
										console.error('An error occurred:', error);
										res.status(500).send('Error saving data');
									} else {
										res.status(200).send(`Data saved successfully`);
									}
								});
							});
						});
					});
				});
			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
		});
};
/**Get Data from ax MSSQL server*/
const getOnForCaseBarcode_B20 = async (req, res) => {
	const comp = 'b20';
	const database = 'variant_masterfile_b20';

	poolConnect
		.then(() => {
			console.log('Connected to SQL Server');
			const request = new sql.Request(pool);

			// Query 1
			request.query(`select a.dataareaid as COMP,a.ITEMID,REPLACE(REPLACE(c.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SERACHNAME,REPLACE(REPLACE(d.NAME,CHAR(13),','),CHAR(10),',') as NAME 
			,REPLACE(REPLACE(d.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,b.CONFIGID,b.INVENTSIZEID as SIZE,b.INVENTCOLORID as COLOR,b.INVENTSTYLEID as STYLE 
			,b.INVENTSERIALID as BARCODE,b.INVENTSITEID as SITE,b.INVENTLOCATIONID as WAREHOUSE,b.WMSLOCATIONID as LOCATION,FORMAT(sum(a.AVAILPHYSICAL),'######.00') as AVAIL_PHYSICAL 
			,FORMAT(sum(a.ORDERED),'######.00') as ORDERED_inTotal,FORMAT(sum(a.ONORDER),'######.00') as OnORder 
			,format(sum(a.POSTEDVALUE),'#########.00')as FIN_COST_AMOUNT,format(case when isnull(sum(a.POSTEDVALUE),0)=0 or sum(a.POSTEDQTY)=0 then 0 else (sum(a.POSTEDVALUE)/sum(a.POSTEDQTY)) end,'#########.00') as COSTPRICE,FORMAT(k.PRICE,'######.00') as PURCH_PRICE 
			,g.NAME as PROD_CATEGORY,i.NAME as ITEMGROUP,j.LASTUPDATE 
			from INVENTSUM a
			left join INventdim b on a.inventdimid=b.inventdimid
			LEFT JOIN Ecoresproduct c on a.ITEMID=c.DISPLAYPRODUCTNUMBER 
			left join ECORESPRODUCTTRANSLATION d on c.RECID=d.PRODUCT  
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='${comp}' ) e on a.itemid=e.ITEMID 
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='${comp}' ) k on a.itemid=k.ITEMID 
			left join ECORESPRODUCTCATEGORY f on c.RECID=f.PRODUCT and f.CATEGORY<>0  
			left join  EcoResCategory g on f.CATEGORY=g.RECID 
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='${comp}') h on a.itemid=h.ITEMID 
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='${comp}') i on h.ITEMGROUPID=i.ITEMGROUPID 
			left join (Select ITEMID,max(LASTUPDDATEPHYSICAL) as LASTUPDATE from INVENTSUM group by ITEMID) j on a.ITEMID=j.ITEMID 
			where AVAILPHYSICAL != 0 and a.DATAAREAID='${comp}' --and b.INVENTSITEID='BA' 
			group by a.dataareaid,a.itemid,c.SEARCHNAME,d.NAME,d.DESCRIPTION,b.configid,b.INVENTSIZEID,b.INVENTCOLORID,b.INVENTSTYLEID,b.INVENTSERIALID,b.INVENTSITEID,b.INVENTLOCATIONID,b.WMSLOCATIONID,e.PRICE,k.PRICE,g.NAME,i.NAME,j.LASTUPDATE,d.DESCRIPTION,a.POSTEDVALUE 
			order by a.DATAAREAID,b.INVENTLOCATIONID,a.ITEMID`, (err1, result1) => {
				if (err1) {
					console.error('Error in Query 1:', err1);
					return res.status(500).json({ error: 'Database error in Query 1' });
				}
				// console.log(result1)


				// 				 /**  delete the new record to the desired id*/
				const newData2 = result1.recordset;

				const result11 = newData2.map(item => {
					// Check if ITEMCASEBARCODE is null or an empty string
					if (item.BARCODE === null || item.BARCODE === '') {
						// Concatenate multiple properties and set it as ITEMCASEBARCODE
						return {
							...item,
							BARCODE: item.ITEMID + item.CONFIGID + item.SIZE + item.COLOR + item.STYLE,
						};
					} else {
						// If false, return the original record
						return item;
					}
				});
				const deleterQuery = `DELETE FROM ${database}`;
				connection.query(deleterQuery, (error, results) => {
					if (error) {
						console.error('An error occurred while inserting the record:', error);
						return;
					}

					connection.query(`ALTER TABLE ${database} AUTO_INCREMENT = 1;`, (error, results) => {
						if (error) {
							console.error('An error occurred while setting auto-increment back:', error);
							// res.status(500).send('Error enabling auto-increment');
						} else {
							console.log('Auto-increment set back on id column.');
							// res.status(200).send('Data deleted successfully');
						}
					});
					const noCaseBarCode = result11.map(item => {
						if (item.COMP === 'b20' && (!item.BARCODE || item.BARCODE.length < 5)) {
							// If the conditions are met, update BARCODE with a new value
							return { ...item, BARCODE: `${item.ITEMID}${item.CONFIGID}${item.SIZE}${item.COLOR}${item.STYLE}` };
						  } else {
							// If the conditions are not met, return the original item
							return item;
						  }
					  });
					let values = [];
					let query = '';
					const placeholders = Array(noCaseBarCode.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
					noCaseBarCode.forEach(item => {

						values.push(
							item.ITEMID, item.SERACHNAME, item.NAME, item.DESCRIPTION, null, null, item.ITEMGROUP, item.CONFIGID, item.STYLE, item.COLOR, item.SIZE,
							null, null, null, item.SITE, null, null,
							null, null, item.BARCODE, null, null, null, null,
							item.COMP, null, item.BARCODE
						);
					});

					query = `INSERT INTO ${database} (ITEMID, SEARCHNAME, ITEMNAME, DESCRIPTION, UNITID, ITEMGROUPID, ITEMGROUP_NAME, CONFIG, STYLE, COLOR, SIZE,
BUSINESSUNIT, COSTCENTER, DEPARTMENT, SITE, AYH_PRODUCTGROUP, B20_PRODUCTGROUP,
UNIQUE_DESC, PRODUCTBARCODE, CASEBARCODE, DESCRIPTION1, INVENTDIMID, PRODUCT, PRODUCTMASTER, 
DATAAREAID, RECID, ITEMCASEBARCODE, Created_At, Updated_At) VALUES ${placeholders}`;
					// First, delete all data in the 'site_and_warehouse' table

					// console.log('Generated SQL query:', query);
					connection.query(query, values, (error, results) => {
						if (error) {
							console.error('An error occurred:', error);
							res.status(500).send('Error saving data');
						} else {
							res.status(200).send(`Data saved successfully`);
							// console.log(results)
						}
					});


				});
				// });
				//   });
			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
			res.status(500).json({ error: 'Database connection error' });
		});
};


/**Get Data from onhand based on b20 and fg*/
const get_Item_Details_b20_onhand_FG = async (req, res) => {
	// console.log('query paramms', req.query)
	const cb = req.query.Case_barcode;
	const database = 'physical_count_onhand';

	try {
		const query = `SELECT * FROM ${database} where BARCODE = '${cb}'`;
		const results = await executeQuery(query);
		res.status(200).json(results);
		// console.log('results',results)
	} catch (error) {
		// console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
// 	poolConnect
// 		.then(() => {
// 			console.log('Connected to SQL Server');
// 			const request = new sql.Request(pool);

// 			// Query 1
// 			request.query(`select a.dataareaid as COMP,a.ITEMID,REPLACE(REPLACE(c.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SERACHNAME,REPLACE(REPLACE(d.NAME,CHAR(13),','),CHAR(10),',') as NAME 
// 			,REPLACE(REPLACE(d.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,b.CONFIGID,b.INVENTSIZEID as SIZE,b.INVENTCOLORID as COLOR,b.INVENTSTYLEID as STYLE 
// 			,b.INVENTSERIALID as BARCODE,b.INVENTSITEID as SITE,b.INVENTLOCATIONID as WAREHOUSE,b.WMSLOCATIONID as LOCATION,FORMAT(sum(a.AVAILPHYSICAL),'######.00') as AVAIL_PHYSICAL 
// 			,FORMAT(sum(a.ORDERED),'######.00') as ORDERED_inTotal,FORMAT(sum(a.ONORDER),'######.00') as OnORder 
// 			,format(sum(a.POSTEDVALUE),'#########.00')as FIN_COST_AMOUNT,format(case when isnull(sum(a.POSTEDVALUE),0)=0 or sum(a.POSTEDQTY)=0 then 0 else (sum(a.POSTEDVALUE)/sum(a.POSTEDQTY)) end,'#########.00') as COSTPRICE,FORMAT(k.PRICE,'######.00') as PURCH_PRICE 
// 			,g.NAME as PROD_CATEGORY,i.NAME as ITEMGROUP,j.LASTUPDATE 
// 			from INVENTSUM a
// 			left join INventdim b on a.inventdimid=b.inventdimid
// 			LEFT JOIN Ecoresproduct c on a.ITEMID=c.DISPLAYPRODUCTNUMBER 
// 			left join ECORESPRODUCTTRANSLATION d on c.RECID=d.PRODUCT  
// 			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='${comp}' ) e on a.itemid=e.ITEMID 
// 			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='${comp}' ) k on a.itemid=k.ITEMID 
// 			left join ECORESPRODUCTCATEGORY f on c.RECID=f.PRODUCT and f.CATEGORY<>0  
// 			left join  EcoResCategory g on f.CATEGORY=g.RECID 
// 			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='${comp}') h on a.itemid=h.ITEMID 
// 			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='${comp}') i on h.ITEMGROUPID=i.ITEMGROUPID 
// 			left join (Select ITEMID,max(LASTUPDDATEPHYSICAL) as LASTUPDATE from INVENTSUM group by ITEMID) j on a.ITEMID=j.ITEMID 
// 			where AVAILPHYSICAL != 0 and a.DATAAREAID='${comp}' --and b.INVENTSITEID='BA' 
// 			group by a.dataareaid,a.itemid,c.SEARCHNAME,d.NAME,d.DESCRIPTION,b.configid,b.INVENTSIZEID,b.INVENTCOLORID,b.INVENTSTYLEID,b.INVENTSERIALID,b.INVENTSITEID,b.INVENTLOCATIONID,b.WMSLOCATIONID,e.PRICE,k.PRICE,g.NAME,i.NAME,j.LASTUPDATE,d.DESCRIPTION,a.POSTEDVALUE 
// 			order by a.DATAAREAID,b.INVENTLOCATIONID,a.ITEMID`, (err1, result1) => {
// 				if (err1) {
// 					console.error('Error in Query 1:', err1);
// 					return res.status(500).json({ error: 'Database error in Query 1' });
// 				}
// 				console.log(result1)


// 				// 				 /**  delete the new record to the desired id*/
// 				const newData2 = result1.recordset;

// 				const result11 = newData2.map(item => {
// 					// Check if ITEMCASEBARCODE is null or an empty string
// 					if (item.BARCODE === null || item.BARCODE === '') {
// 						// Concatenate multiple properties and set it as ITEMCASEBARCODE
// 						return {
// 							...item,
// 							BARCODE: item.ITEMID + item.CONFIGID + item.SIZE + item.COLOR + item.STYLE,
// 						};
// 					} else {
// 						// If false, return the original record
// 						return item;
// 					}
// 				});
// 				const deleterQuery = `DELETE FROM ${database}`;
// 				connection.query(deleterQuery, (error, results) => {
// 					if (error) {
// 						console.error('An error occurred while inserting the record:', error);
// 						return;
// 					}

// 					connection.query(`ALTER TABLE ${database} AUTO_INCREMENT = 1;`, (error, results) => {
// 						if (error) {
// 							console.error('An error occurred while setting auto-increment back:', error);
// 							// res.status(500).send('Error enabling auto-increment');
// 						} else {
// 							console.log('Auto-increment set back on id column.');
// 							// res.status(200).send('Data deleted successfully');
// 						}
// 					});
// 					const noCaseBarCode = result11.map(item => {
// 						if (item.COMP === 'b20' && (!item.BARCODE || item.BARCODE.length < 5)) {
// 							// If the conditions are met, update BARCODE with a new value
// 							return { ...item, BARCODE: `${item.ITEMID}${item.CONFIGID}${item.SIZE}${item.COLOR}${item.STYLE}` };
// 						  } else {
// 							// If the conditions are not met, return the original item
// 							return item;
// 						  }
// 					  });
// 					let values = [];
// 					let query = '';
// 					const placeholders = Array(noCaseBarCode.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
// 					noCaseBarCode.forEach(item => {

// 						values.push(
// 							item.ITEMID, item.SERACHNAME, item.NAME, item.DESCRIPTION, null, null, item.ITEMGROUP, item.CONFIGID, item.STYLE, item.COLOR, item.SIZE,
// 							null, null, null, item.SITE, null, null,
// 							null, null, item.BARCODE, null, null, null, null,
// 							item.COMP, null, item.BARCODE
// 						);
// 					});

// 					query = `INSERT INTO ${database} (ITEMID, SEARCHNAME, ITEMNAME, DESCRIPTION, UNITID, ITEMGROUPID, ITEMGROUP_NAME, CONFIG, STYLE, COLOR, SIZE,
// BUSINESSUNIT, COSTCENTER, DEPARTMENT, SITE, AYH_PRODUCTGROUP, B20_PRODUCTGROUP,
// UNIQUE_DESC, PRODUCTBARCODE, CASEBARCODE, DESCRIPTION1, INVENTDIMID, PRODUCT, PRODUCTMASTER, 
// DATAAREAID, RECID, ITEMCASEBARCODE, Created_At, Updated_At) VALUES ${placeholders}`;
// 					// First, delete all data in the 'site_and_warehouse' table

// 					// console.log('Generated SQL query:', query);
// 					connection.query(query, values, (error, results) => {
// 						if (error) {
// 							console.error('An error occurred:', error);
// 							res.status(500).send('Error saving data');
// 						} else {
// 							res.status(200).send(`Data saved successfully`);
// 							console.log(results)
// 						}
// 					});


// 				});
// 				// });
// 				//   });
// 			});
// 		})
// 		.catch((err) => {
// 			console.error('Error connecting to SQL Server:', err);
// 			res.status(500).json({ error: 'Database connection error' });
// 		});
};
/**Get Data from ax MSSQL server*/
const get_on_hand_for_variance = async (req, res) => {
	const header = req.query.header;
	const comp = req.query.comp;
	const site = req.query.site;
	const count = req.query.count;
	const orig_prodType = req.query.orig_prodType;
	const whl = req.query.whl;


	const parts = header.split('/'); // Split the string by "/"
	const ohdate = parts[parts.length - 1];

	const uniqueCount = `${comp}${site}${whl}${count}${orig_prodType}${ohdate}`;
	// console.log(req.query)
	const orig_prodTypeArray = orig_prodType.split(',');
	// console.log('uniqueCount', uniqueCount);
	const database = 'physical_count_onhand';

	poolConnect
		.then(() => {
			console.log('Connected to SQL Server');
			const request = new sql.Request(pool);

			// Query 1
			request.query(`select a.dataareaid as COMP,a.ITEMID,REPLACE(REPLACE(c.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SERACHNAME,REPLACE(REPLACE(d.NAME,CHAR(13),','),CHAR(10),',') as NAME 
			,REPLACE(REPLACE(d.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,b.CONFIGID,b.INVENTSIZEID as SIZE,b.INVENTCOLORID as COLOR,b.INVENTSTYLEID as STYLE 
			,b.INVENTSERIALID as BARCODE,b.INVENTSITEID as SITE,b.INVENTLOCATIONID as WAREHOUSE,b.WMSLOCATIONID as LOCATION,FORMAT(sum(a.AVAILPHYSICAL),'######.00') as AVAIL_PHYSICAL 
			,FORMAT(sum(a.ORDERED),'######.00') as ORDERED_inTotal,FORMAT(sum(a.ONORDER),'######.00') as OnORder 
			,format(sum(a.POSTEDVALUE),'#########.00')as FIN_COST_AMOUNT,format(case when isnull(sum(a.POSTEDVALUE),0)=0 or sum(a.POSTEDQTY)=0 then 0 else (sum(a.POSTEDVALUE)/sum(a.POSTEDQTY)) end,'#########.00') as COSTPRICE,FORMAT(k.PRICE,'######.00') as PURCH_PRICE 
			,g.NAME as PROD_CATEGORY,i.NAME as ITEMGROUP,j.LASTUPDATE 
			from INVENTSUM a
			left join INventdim b on a.inventdimid=b.inventdimid
			LEFT JOIN Ecoresproduct c on a.ITEMID=c.DISPLAYPRODUCTNUMBER 
			left join ECORESPRODUCTTRANSLATION d on c.RECID=d.PRODUCT  
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='${comp}' ) e on a.itemid=e.ITEMID 
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='${comp}' ) k on a.itemid=k.ITEMID 
			left join ECORESPRODUCTCATEGORY f on c.RECID=f.PRODUCT and f.CATEGORY<>0  
			left join  EcoResCategory g on f.CATEGORY=g.RECID 
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='${comp}') h on a.itemid=h.ITEMID 
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='${comp}') i on h.ITEMGROUPID=i.ITEMGROUPID 
			left join (Select ITEMID,max(LASTUPDDATEPHYSICAL) as LASTUPDATE from INVENTSUM group by ITEMID) j on a.ITEMID=j.ITEMID 
			where AVAILPHYSICAL != 0 and a.DATAAREAID='${comp}' and b.INVENTSITEID = '${site}' --and b.INVENTSITEID='BA' 
			group by a.dataareaid,a.itemid,c.SEARCHNAME,d.NAME,d.DESCRIPTION,b.configid,b.INVENTSIZEID,b.INVENTCOLORID,b.INVENTSTYLEID,b.INVENTSERIALID,b.INVENTSITEID,b.INVENTLOCATIONID,b.WMSLOCATIONID,e.PRICE,k.PRICE,g.NAME,i.NAME,j.LASTUPDATE,d.DESCRIPTION,a.POSTEDVALUE 
			order by a.DATAAREAID,b.INVENTLOCATIONID,a.ITEMID`, (err1, result1) => {
				if (err1) {
					console.error('Error in Query 1:', err1);
					return res.status(500).json({ error: 'Database error in Query 1' });
				}


				const recordsWithUniqueKey = result1.recordset.map((rec) => {
					let UniqueKey;
					if (comp === 'ayh') {
						UniqueKey = `${comp}${site}${whl}${count}${orig_prodType}${ohdate}${rec.ITEMID}${rec.CONFIGID}${rec.SIZE}${rec.COLOR}${rec.STYLE}${rec.SITE}${rec.WAREHOUSE}${rec.LOCATION}`;
					}else if (comp === 'b20') {
						UniqueKey = `${comp}${site}${whl}${count}${orig_prodType}${ohdate}${rec.ITEMID}${rec.CONFIGID}${rec.SIZE}${rec.COLOR}${rec.STYLE}${rec.SITE}${rec.WAREHOUSE}${rec.LOCATION}${rec.BARCODE}`;
					}
					const ITEM_PER_SITE_WAREHOUSE = `${comp}${site}${whl}${count}${orig_prodType}${ohdate}${rec.ITEMID}${rec.CONFIGID}${rec.SIZE}${rec.COLOR}${rec.STYLE}${rec.SITE}${rec.WAREHOUSE}`;
					return {
						...rec,
						UniqueKey,
						ITEM_PER_SITE_WAREHOUSE

					};
				});
				// console.log(recordsWithUniqueKey)
				const filteredResult = recordsWithUniqueKey.filter(item => item.WAREHOUSE === `${whl}`);
				// const database = 'physical_count_onhand';
				const dataToInsert = filteredResult;

				// 				 /**  delete the new record to the desired id*/
				const deleterQuery = `DELETE FROM ${database} WHERE Unique_Count = '${uniqueCount}'`;
				connection.query(deleterQuery, (error, results) => {
					if (error) {
						console.error('An error occurred while inserting the record:', error);
						return;
					}

					connection.query(`ALTER TABLE ${database} AUTO_INCREMENT = 1;`, (error, results) => {
						if (error) {
							console.error('An error occurred while setting auto-increment back:', error);
							// res.status(500).send('Error enabling auto-increment');
						} else {
							console.log('Auto-increment set back on id column.');
							// res.status(200).send('Data deleted successfully');
						}
					});

					let values = [];
					let query = '';

					// const filteredResults = dataToInsert.filter(item => orig_prodTypeArray.includes(item.ITEMGROUP.trim()));

					// console.log(filteredResults);
					const filteredResults = dataToInsert.filter(item => {
						// Convert both ITEMGROUP and itemGroup values to lowercase for case-insensitive matching
						const itemGroup = item.ITEMGROUP.toLowerCase();
						return orig_prodTypeArray.some(group => itemGroup.includes(group.toLowerCase()));
					});
					const noCaseBarCode = filteredResults.map(item => {
						if (item.COMP === 'b20' && (!item.BARCODE || item.BARCODE.length < 5)) {
							// If the conditions are met, update BARCODE with a new value
							return { ...item, BARCODE: `${item.ITEMID}${item.CONFIGID}${item.SIZE}${item.COLOR}${item.STYLE}` };
						  } else {
							// If the conditions are not met, return the original item
							return item;
						  }
					  });
					
					//   console.log('noCaseBarCode', noCaseBarCode);

					const placeholders = Array(noCaseBarCode.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
					noCaseBarCode.forEach(item => {
						// const uniqueCount = 
						const iAVAIL_PHYSICAL = !isNaN(item.AVAIL_PHYSICAL) && item.AVAIL_PHYSICAL !== '' ? parseFloat(item.AVAIL_PHYSICAL) : null;
						const iORDERED_inTotal = !isNaN(item.ORDERED_inTotal) && item.ORDERED_inTotal !== '' ? parseFloat(item.ORDERED_inTotal) : null;
						const iOnORder = !isNaN(item.OnORder) && item.OnORder !== '' ? parseFloat(item.OnORder) : null;
						const iFIN_COST_AMOUNT = !isNaN(item.FIN_COST_AMOUNT) && item.FIN_COST_AMOUNT !== '' ? parseFloat(item.FIN_COST_AMOUNT) : null;
						const iCOSTPRICE = !isNaN(item.COSTPRICE) && item.COSTPRICE !== '' ? parseFloat(item.COSTPRICE) : null;
						const iPURCH_PRICE = !isNaN(item.PURCH_PRICE) && item.PURCH_PRICE !== '' ? parseFloat(item.PURCH_PRICE) : null;
						values.push(
							header,
							uniqueCount,
							orig_prodType,
							iAVAIL_PHYSICAL,
							item.BARCODE,
							item.COLOR,
							item.COMP,
							item.CONFIGID,
							iCOSTPRICE,
							item.DESCRIPTION,
							iFIN_COST_AMOUNT,
							item.ITEMGROUP,
							item.ITEMID,
							item.LASTUPDATE,
							item.LOCATION,
							item.ITEM_PER_SITE_WAREHOUSE,
							item.NAME,
							iORDERED_inTotal,
							iOnORder,
							item.PROD_CATEGORY,
							iPURCH_PRICE,
							item.SERACHNAME,
							item.SITE,
							item.SIZE,
							item.STYLE,
							item.UniqueKey,
							item.WAREHOUSE
						);
					});

					query = `INSERT INTO ${database} (Header, Unique_Count, Original_ProductType, AVAIL_PHYSICAL, BARCODE, COLOR, COMP, CONFIGID, COSTPRICE, DESCRIPTION, FIN_COST_AMOUNT,
							ITEMGROUP, ITEMID, LASTUPDATE, LOCATION, ITEM_PER_SITE_WAREHOUSE, NAME, ORDERED_inTotal, OnORder, PROD_CATEGORY, PURCH_PRICE,
							SERACHNAME, SITE, SIZE, STYLE, UniqueKey, WAREHOUSE, Created_At, Updated_At) VALUES ${placeholders}`;


					// console.log('Generated SQL query:', query);
					connection.query(query, values, (error, results) => {
						if (error) {
							console.error('An error occurred:', error);
							res.status(500).send('Error saving data');
						} else {
							const retrieveQuery = `SELECT * FROM ${database}`;
							connection.query(retrieveQuery, (retrieveError, retrieveResults) => {
								if (retrieveError) {
									console.error('Error:', retrieveError);
									res.status(500).send('An error occurred while retrieving the products.');
								} else {
									res.status(200).json(retrieveResults);
								}
							});
						}
					});
				});
			});
			//   });
			// });
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
			res.status(500).json({ error: 'Database connection error' });
		});
};

/**Check if unique count already existed */
const check_unique_code = (req, res) => {
	const header = req.query.header;
	const comp = req.query.comp;
	const site = req.query.site;
	const count = req.query.count;
	const orig_prodType = req.query.orig_prodType;
	const whl = req.query.whl;

	const parts = header.split('/'); // Split the string by "/"
	const ohdate = parts[parts.length - 1];

	const uniqueCount = `${comp}${site}${whl}${count}${orig_prodType}${ohdate}`;
	// console.log('unique count check',uniqueCount)
	const orig_prodTypeArray = orig_prodType.split(',');

	const database = 'physical_count_onhand';
	const retrieveQuery = `SELECT * FROM ${database} WHERE Unique_Count = '${uniqueCount}'`;
	connection.query(retrieveQuery, (retrieveError, retrieveResults) => {
		if (retrieveError) {
			console.error('Error:', retrieveError);
			res.status(500).send('An error occurred while retrieving the products.');
		} else {
			res.status(200).json(retrieveResults);
		}
	});
}
/**===============================POST=============================== */
const start_physical_count = (req, res) => {
	const io = require('../server').io;

	// console.log('p count', req.body);
	const company = req.body.company;

	// let database = '';
	let newRecord = [];
	// if (company === 'Bataan2020') {
	const database = 'physical_count_transaction';

	const data = {
		Site,
		Company,
		TransactionDate,
		CountType,
		Orig_ProductType,
		ProductType,
		warehouse
	} = req.body;

	const modifiedProductType = Orig_ProductType.map(item => {
		if (item.substring(0, 2) === 'FG') {
			return 'FG';
		} else if (item.substring(0, 2) === 'RM') {
			return 'RM';
		}
		return item; // Keep the original text for other values
	});

	const uniqueProductTypes = [...new Set(modifiedProductType)];

	// console.log(uniqueProductTypes);
	const prodType = uniqueProductTypes.join(',');
	const Orig_prodType = Orig_ProductType.join(',');
	const Header = `${data.Company}/${data.Site}/${data.warehouse}/${data.CountType}/${prodType}/${data.TransactionDate}`;
	newRecord = {
		Site: Site,
		Warehouse: warehouse,
		Company: Company,
		Header: Header,
		Transaction_Date: TransactionDate,
		CountType: CountType,
		Original_ProductType: Orig_prodType,
		ProductType: prodType,
		Disable_On_Mobile: 'false',
		Created_At: new Date(),
		Updated_At: new Date(),
	};
	// } 

	/**  Insert the new record to the desired id*/

	const insertQuery = `INSERT INTO ${database} SET ?`;
	connection.query(insertQuery, newRecord, (error, results) => {
		if (error) {
			console.error('An error occurred while inserting the record:', error);
			return;
		}
		// Retrieve the inserted record with its id
		const insertedId = results.insertId;
		const selectQuery = `SELECT * FROM ${database} WHERE id = ?`;

		connection.query(selectQuery, [insertedId], (error, rows) => {
			if (error) {
				console.error('An error occurred while fetching the record:', error);
				return;
			}

			const actualRecord = rows[0];

			// Emit the actual record through the socket to all connected clients
			io.emit('newTransaction', actualRecord);

			res.json({ msg: 'Data saved successfully' });
		});
	});
};

/**Create batch number */
const create_batch_number = async (req, res) => {

	let newRecord = [];
	// console.log('batch number create', req.body);
	const devId = req.body.deviceId;
	const devIdComponents = devId.split('-');
	const id = devIdComponents[3];

	const date = new Date().toLocaleDateString();
	const dateComponents = date.split('/');

	const month = dateComponents[0]; // 10
	const day = dateComponents[1];   // 11
	const year = dateComponents[2];  // 2023

	// console.log(date)
	const database = 'physical_count_batch_number';
	try {
		const query = `SELECT * FROM ${database}`;
		const results = await executeQuery(query);
		if (results.length > 0) {
			const tr_number = results[results.length - 1].Transaction_number;
			const parts = tr_number.split("-");
			const numericPart = parts[0].split("PC")[1];
			const numericPart2 = numericPart.slice(8);
			const numericValue = parseInt(numericPart2, 10);
			const incrementedValue = numericValue + 1;
			const newNumericPart = String(incrementedValue).padStart(4, '0');
			const trans_no = `PC${year}${month}${day}${newNumericPart}-${id}`;

			newRecord = {
				Transaction_number: trans_no,
				Device_Id: devId,
				Created_At: new Date(),
				Updated_At: new Date(),
			};
			const insertQuery = `INSERT INTO physical_count_batch_number SET ?`;
			connection.query(insertQuery, newRecord, (error, results) => {
				if (error) {
					console.error('An error occurred while inserting the record:', error);
					return;
				}

				// Get the ID of the newly inserted record
				const insertedId = results.insertId;

				// Now, fetch the inserted data using the ID
				const selectQuery = 'SELECT * FROM physical_count_batch_number WHERE id = ?';
				connection.query(selectQuery, [insertedId], (selectError, selectResults) => {
					if (selectError) {
						console.error('An error occurred while selecting the inserted record:', selectError);
						return;
					}
					// Send the newly inserted data back to the client
					res.json({ msg: 'Data saved successfully', insertedData: selectResults[0] });
				});
			});
		}


		/**If no transaction is created */
		else {
			const trans_no = `PC${year}${month}${day}0001-${id}`;
			// console.log('trans_no', trans_no)

			newRecord = {
				Transaction_number: trans_no,
				Device_Id: devId,
				Created_At: new Date(),
				Updated_At: new Date(),
			};
			const insertQuery = `INSERT INTO physical_count_batch_number SET ?`;
			connection.query(insertQuery, newRecord, (error, results) => {
				if (error) {
					console.error('An error occurred while inserting the record:', error);
					return;
				}

				// Get the ID of the newly inserted record
				const insertedId = results.insertId;

				// Now, fetch the inserted data using the ID
				const selectQuery = 'SELECT * FROM physical_count_batch_number WHERE id = ?';
				connection.query(selectQuery, [insertedId], (selectError, selectResults) => {
					if (selectError) {
						console.error('An error occurred while selecting the inserted record:', selectError);
						return;
					}
					// Send the newly inserted data back to the client
					res.json({ msg: 'Data saved successfully', insertedData: selectResults[0] });
				});
			});
		}

	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
}

/**save PC Records */
const insert_PC_Record = (req, res) => {
	const io = require('../server').io;


	const company = req.body.company;

	// let database = '';
	let newRecord = [];
	// if (company === 'Bataan2020') {
	const database = 'physical_count';

	const data = {
		Header,
		Company,
		Site,
		CountType,
		ProductType,
		Transaction_Date,
		Warehouse,
		Counter_Name,
		Verifier_Name,
		Transaction_Number,
		Case_Barcode,
		Item_Code,
		Item_Description,
		Item_Config,
		Item_Size,
		Item_Color,
		Item_Style,
		UniqueCode,
		Item_Location,
		Scanned_Location,
		Item_group,
		Quantity,
		Device_id,
		Count_Status,
		ITEM_PER_SITE_WAREHOUSE,
		Original_ProductType,
		Unique_Count,
		BUSINESSUNIT,
		COSTCENTER,
		DEPARTMENT,
		SITEF,
		AYH_PRODUCTGROUP,
		B20_PRODUCTGROUP
	} = req.body;


	const iQuantity = !isNaN(Quantity) && Quantity !== '' ? parseInt(Quantity) : null;
	newRecord = {
		Header: Header,
		Company: Company,
		Site: Site,
		CountType: CountType,
		ProductType: ProductType,
		Transaction_Date: new Date(Transaction_Date),
		Warehouse: Warehouse,
		Counter_Name: Counter_Name,
		Verifier_Name: Verifier_Name,
		Transaction_Number: Transaction_Number,
		Case_Barcode: Case_Barcode,
		Item_Code: Item_Code,
		Item_Description: Item_Description,
		Config: Item_Config,
		Size: Item_Size,
		Color: Item_Color,
		Style: Item_Style,
		Unique_Count: Unique_Count,
		Original_ProductType: Original_ProductType,
		ITEM_PER_SITE_WAREHOUSE: ITEM_PER_SITE_WAREHOUSE,
		UniqueCode: UniqueCode,
		Item_Location: Item_Location,
		Scanned_Location: Scanned_Location,
		Item_group: Item_group,
		Quantity: iQuantity,
		Device_id: Device_id,
		Count_Status: Count_Status,
		BUSINESSUNIT: BUSINESSUNIT,
		COSTCENTER: COSTCENTER,
		DEPARTMENT: DEPARTMENT,
		SITEF: SITEF,
		AYH_PRODUCTGROUP: AYH_PRODUCTGROUP,
		B20_PRODUCTGROUP: B20_PRODUCTGROUP,
		Created_At: new Date(),
		Updated_At: new Date(),
	};
	// } 

	/**  Insert the new record to the desired id*/

	const insertQuery = `INSERT INTO ${database} SET ?`;
	connection.query(insertQuery, newRecord, (error, results) => {
		if (error) {
			console.error('An error occurred while inserting the record:', error);
			return;
		}
		// Retrieve the inserted record with its id
		const insertedId = results.insertId;
		const selectQuery = `SELECT * FROM ${database} WHERE id = ?`;

		connection.query(selectQuery, [insertedId], (error, rows) => {
			if (error) {
				console.error('An error occurred while fetching the record:', error);
				return;
			}

			const actualRecord = rows[0];

			// Emit the actual record through the socket to all connected clients
			io.emit('newRecord', actualRecord);

			res.json({ msg: 'Data saved successfully' });
		});
	});
}

/**Upload site and warehouse */
const upload_site = (req, res) => {
	const io = require('../server').io;

	// console.log('p count', req.body);

	// let database = '';
	let newRecord = [];
	// if (company === 'Bataan2020') {
	const database = 'site_and_warhouse';

	const data = {
		Site,
		Warehouse,
	} = req.body;

	newRecord = {
		Site: Site,
		Warehouse: Warehouse,
		Location: null,
		Created_At: new Date(),
		Updated_At: new Date(),
	};
	// } 

	/**  Insert the new record to the desired id*/

	const insertQuery = `INSERT INTO ${database} SET ?`;
	connection.query(insertQuery, newRecord, (error, results) => {
		if (error) {
			console.error('An error occurred while inserting the record:', error);
			return;
		}

		// Emit a 'newPlate' event to all connected clients
		// io.emit('newSite', newRecord);

		res.json({ msg: 'Data saved successfully' });
	});
};

/**Upload Onhand */
const upload_on_hand = (req, res) => {
	// console.log('p count', req.body);
	const cvsFile = req.body.uploadedCsvFile;
	let values = [];
	let query = '';

	const database = 'physical_count_onhand';

	const placeholders = Array(cvsFile.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
	cvsFile.forEach(item => {
		const iAVAIL_PHYSICAL = !isNaN(item.AVAIL_PHYSICAL) && item.AVAIL_PHYSICAL !== '' ? parseFloat(item.AVAIL_PHYSICAL) : null;
		const iORDERED_inTotal = !isNaN(item.ORDERED_inTotal) && item.ORDERED_inTotal !== '' ? parseFloat(item.ORDERED_inTotal) : null;
		const iOnORder = !isNaN(item.OnORder) && item.OnORder !== '' ? parseFloat(item.OnORder) : null;
		const iFIN_COST_AMOUNT = !isNaN(item.FIN_COST_AMOUNT) && item.FIN_COST_AMOUNT !== '' ? parseFloat(item.FIN_COST_AMOUNT) : null;
		const iCOSTPRICE = !isNaN(item.COSTPRICE) && item.COSTPRICE !== '' ? parseFloat(item.COSTPRICE) : null;
		const iPURCH_PRICE = !isNaN(item.PURCH_PRICE) && item.OnORder !== '' ? parseFloat(item.PURCH_PRICE) : null;

		values.push(

			item.COMP, item.ITEMID, item.SERACHNAME, item.NAME, item.DESCRIPTION, item.CONFIGID, item.SIZE, item.COLOR, item.STYLE, item.BARCODE, item.SITE,
			item.WAREHOUSE, item.LOCATION, iAVAIL_PHYSICAL, iORDERED_inTotal, iOnORder, iFIN_COST_AMOUNT, iCOSTPRICE, iPURCH_PRICE, item.ITEMGROUP,
			new Date(item.LASTUPDATE), item.CASEBARCODE
		);
	});

	query = `INSERT INTO physical_count_onhand (COMP, ITEMID, SERACHNAME, NAME, DESCRIPTION, CONFIGID, SIZE, COLOR, STYLE, BARCODE,
			SITE, WAREHOUSE, LOCATION, AVAIL_PHYSICAL, ORDERED_inTotal, OnORder, FIN_COST_AMOUNT, COSTPRICE, PURCH_PRICE, ITEMGROUP, LASTUPDATE,
			CASEBARCODE, Created_at, Updated_at
        ) VALUES ${placeholders}`;

	// console.log('Generated SQL query:', query);
	connection.query(query, values, (error, results) => {
		if (error) {
			console.error('An error occurred:', error);
			res.status(500).send('Error saving data');
		} else {
			res.status(200).send(`Data saved successfully`);
		}
	});
};


/**===============================UPDATE================== */

const updateTransactionStatus = (req, res) => {
	const io = require('../server').io;
	const id = req.params.id;
	// console.log('update', req.body)

	const { Disable_On_Mobile } = req.body;

	// Assuming you have a MySQL connection already established
	const sql = 'UPDATE physical_count_transaction SET Disable_On_Mobile = ? WHERE id = ?';

	// Execute the SQL query to update the database
	connection.query(sql, [Disable_On_Mobile, id], (err, result) => {
		if (err) {
			console.error('Error updating transaction status:', err);
			res.status(500).json({ error: 'Failed to update transaction status' });
		} else {
			// After successfully updating the status, fetch all transactions from the database
			const selectAllTransactionsSQL = 'SELECT * FROM physical_count_transaction';
			connection.query(selectAllTransactionsSQL, (err, transactions) => {
				if (err) {
					console.error('Error fetching transactions:', err);
					res.status(500).json({ error: 'Failed to fetch transactions' });
				} else {
					// Emit the updated transactions to the current active user using socket.io
					io.emit('updatedTransactions', transactions);

					res.status(200).json(transactions);
				}
			});
		}
	});
};
/**For Cancel */
const post_update = (req, res) => {
	const io = require('../server').io;
	const id = req.params.id;
	// console.log('update', req.body)

	const { Status } = req.body;

	const sql = 'UPDATE physical_count SET Count_Status = ?, Updated_At = ? WHERE id = ?';

	const currentDate = new Date();

	// Execute the SQL query to update the database
	connection.query(sql, [Status, currentDate, id], (err, result) => {
		if (err) {
			console.error('Error updating transaction status:', err);
			res.status(500).json({ error: 'Failed to update transaction status' });
		} else {
			// After successfully updating the status, fetch all transactions from the database
			const selectAllTransactionsSQL = 'SELECT * FROM physical_count';
			connection.query(selectAllTransactionsSQL, (err, transactions) => {
				if (err) {
					console.error('Error fetching transactions:', err);
					res.status(500).json({ error: 'Failed to fetch transactions' });
				} else {
					// Emit the updated transactions to the current active user using socket.io
					io.emit('editedTransactions', transactions);
					res.status(200).json({ message: 'Transaction status updated successfully' });
				}
			});
		}
	});
};
const post_update_bulk = (req, res) => {
	const io = require('../server').io;
	const records = req.body.records;
  
	const currentDate = new Date();
	const sql = 'UPDATE physical_count SET Count_Status = ?, Updated_At = ? WHERE id = ?';
  
	// Use Promise.all to execute all SQL queries asynchronously
	Promise.all(
	  records.map(record => {
		return new Promise((resolve, reject) => {
		  connection.query(sql, ['Posted', currentDate, record.id], (err, result) => {
			if (err) {
			  console.error('Error updating transaction status:', err);
			  reject(err);
			} else {
			  resolve(result);
			}
		  });
		});
	  })
	)
	  .then(() => {
		// Fetch all transactions from the database after updating
		const selectAllTransactionsSQL = 'SELECT * FROM physical_count';
		connection.query(selectAllTransactionsSQL, (err, transactions) => {
		  if (err) {
			console.error('Error fetching transactions:', err);
			res.status(500).json({ error: 'Failed to fetch transactions' });
		  } else {
			// Emit the updated transactions to the current active user using socket.io
			io.emit('editedTransactions', transactions);
			res.status(200).json({ message: 'Transaction status updated successfully' });
		  }
		});
	  })
	  .catch(error => {
		console.error('Error updating transaction status:', error);
		res.status(500).json({ error: 'Failed to update transaction status' });
	  });
  };
/**==================================Generate Varianc======================================== */

// const get_scanned_vs_on_hand = async (req, res) => {
// 	// console.log('get_scanned_vs_on_hand', req.query.activeComp)
// 	const database = 'physical_count';
// 	const database2 = 'physical_count_onhand';
// 	const activeComps = req.query.activeComp.split(',');

// 	// try {
// 	// 	const query = `
// 	// 	 SELECT *
// 	// 	  FROM ${database2} 
// 	// 	  WHERE ITEM_PER_SITE_WAREHOUSE = 'INT-00017MCBULFGWH01';
// 	// 	`;
// 	// 	const results = await executeQuery(query);
// 	// 	// res.status(200).json(results);
// 	// 	console.log('result',results)
// 	//   } catch (error) {
// 	// 	console.error('Error:', error);
// 	// 	res.status(500).send('An error occurred while retrieving the products.');
// 	//   }
// 	try {
// 		// const query = `
// 		//   SELECT 
// 		//   physical_count.UniqueCode, 
// 		// 	MAX(physical_count.Case_Barcode) AS Case_Barcode, 
// 		// 	MAX(physical_count.Color) AS Color, 
// 		// 	MAX(physical_count.Company) AS Company, 
// 		// 	MAX(physical_count.Config) AS Config, 
// 		// 	MAX(physical_count.CountType) AS CountType, 
// 		// 	MAX(physical_count.Count_Status) AS Count_Status, 
// 		// 	MAX(physical_count.Counter_Name) AS Counter_Name, 
// 		// 	MAX(physical_count.Created_At) AS Created_At, 
// 		// 	MAX(physical_count.Device_id) AS Device_id, 
// 		// 	MAX(physical_count.Header) AS Header, 
// 		// 	MAX(physical_count.Item_Code) AS Item_Code, 
// 		// 	MAX(physical_count.Item_Description) AS Item_Description, 
// 		// 	MAX(physical_count.Item_Location) AS Item_Location, 
// 		// 	MAX(physical_count.ProductType) AS ProductType, 
// 		// 	SUM(physical_count.Quantity) AS Quantity, 
// 		// 	MAX(physical_count.Scanned_Location) AS Scanned_Location, 
// 		// 	MAX(physical_count.Site) AS Site, 
// 		// 	MAX(physical_count.Size) AS Size, 
// 		// 	MAX(physical_count.Style) AS Style, 
// 		// 	MAX(physical_count.Transaction_Date) AS Transaction_Date, 
// 		// 	MAX(physical_count.Transaction_Number) AS Transaction_Number, 
// 		// 	MAX(physical_count.Updated_At) AS Updated_At, 
// 		// 	MAX(physical_count.Verifier_Name) AS Verifier_Name, 
// 		// 	MAX(physical_count.Warehouse) AS Warehouse, 
// 		// 	MAX(physical_count.id) AS id,
// 		// 	physical_count_onhand.AVAIL_PHYSICAL
// 		//   FROM ${database} AS physical_count
// 		//   LEFT JOIN physical_count_onhand AS physical_count_onhand ON physical_count.UniqueCode = physical_count_onhand.UniqueKey
// 		//   WHERE physical_count.Count_Status = 'Posted'
// 		//   GROUP BY physical_count.UniqueCode, physical_count_onhand.AVAIL_PHYSICAL
// 		// `;
// 		const query2 = `SELECT *
// 		FROM ${database2}
// 		WHERE Unique_Count IN (
// 			SELECT DISTINCT Unique_Count
// 			FROM ${database} WHERE Count_Status = 'Posted'
// 		);`;

// 		const query3 = `SELECT ${database}.*
// 			FROM ${database}
// 			LEFT JOIN ${database2} ON ${database}.UniqueCode = ${database2}.UniqueKey
// 			WHERE ${database2}.UniqueKey IS NULL and Count_Status = 'Posted'`;

// 		const query = `SELECT
// 		UniqueCode,
// 		MAX(Header) AS Header,
// 		MAX(Company) AS Company,
// 		MAX(Site) AS Site,
// 		MAX(CountType) AS CountType,
// 		MAX(ProductType) AS ProductType,
// 		MAX(Transaction_Date) AS Transaction_Date,
// 		MAX(Warehouse) AS Warehouse,
// 		MAX(Counter_Name) AS Counter_Name,
// 		MAX(Verifier_Name) AS Verifier_Name,
// 		MAX(Transaction_Number) AS Transaction_Number,
// 		MAX(Case_Barcode) AS Case_Barcode,
// 		MAX(Item_Code) AS Item_Code,
// 		MAX(Item_Description) AS Item_Description,
// 		MAX(Config) AS Config,
// 		MAX(Size) AS Size,
// 		MAX(Color) AS Color,
// 		MAX(Style) AS Style,
// 		MAX(ITEM_PER_SITE_WAREHOUSE) AS ITEM_PER_SITE_WAREHOUSE,
// 		MAX(Item_Location) AS Item_Location,
// 		MAX(Scanned_Location) AS Scanned_Location,
// 		SUM(Quantity) AS Quantity,
// 		MAX(Device_id) AS Device_id,
// 		MAX(Count_Status) AS Count_Status,
// 		MAX(Item_group) AS Item_group,


// 		MAX(BUSINESSUNIT) AS BUSINESSUNIT,
// 		MAX(COSTCENTER) AS COSTCENTER,
// 		MAX(DEPARTMENT) AS DEPARTMENT,
// 		MAX(SITEF) AS SITEF,
// 		MAX(AYH_PRODUCTGROUP) AS AYH_PRODUCTGROUP,
// 		MAX(B20_PRODUCTGROUP) AS B20_PRODUCTGROUP,

// 		MAX(Created_At) AS Created_At,
// 		MAX(Updated_At) AS Updated_At
// 	FROM ${database} WHERE Count_Status = 'Posted'
// 	GROUP BY UniqueCode;`;

// 		const results = await executeQuery(query);
// 		const results2 = await executeQuery(query2);
// 		const results3 = await executeQuery(query3);
// 		// console.log('results',results)
// 		const variable = [];


// 		results2.forEach((item2) => {
		
// 			// Initialize the status as an empty object
// 			let status = {};
// 			let matchingItem = [];
// 			if (item2.COMP === 'ayh') {
// 				// Find the matching item in results
// 				matchingItem = results.find((item1) => item1.UniqueCode === item2.UniqueKey);
// 			} else {
// 				matchingItem = results.find((item1) => item1.Case_Barcode === item2.BARCODE);
// 			}
// 			// Check if a matching item was found
// 			if (matchingItem) {
// 				// If a match is found, set the properties in the status object based on the matching item
// 				status = {
// 					UniqueCode: matchingItem.UniqueCode,
// 					Header: matchingItem.Header,
// 					Company: matchingItem.Company,
// 					Site: matchingItem.Site,
// 					CountType: matchingItem.CountType,
// 					ProductType: matchingItem.ProductType,
// 					Transaction_Date: matchingItem.Transaction_Date,
// 					Warehouse: matchingItem.Warehouse,
// 					Counter_Name: matchingItem.Counter_Name,
// 					Verifier_Name: matchingItem.Verifier_Name,
// 					Transaction_Number: matchingItem.Transaction_Number,
// 					Case_Barcode: matchingItem.Case_Barcode,
// 					Item_Code: matchingItem.Item_Code,
// 					Item_Description: matchingItem.Item_Description,
// 					Config: matchingItem.Config,
// 					Size: matchingItem.Size,
// 					Color: matchingItem.Color,
// 					Style: matchingItem.Style,
// 					Unique_Count: matchingItem.Style,
// 					Original_ProductType: matchingItem.Original_ProductType,
// 					ITEM_PER_SITE_WAREHOUSE: matchingItem.ITEM_PER_SITE_WAREHOUSE,
// 					Item_Location: matchingItem.Item_Location,
// 					Scanned_Location: matchingItem.Scanned_Location,
// 					Quantity: matchingItem.Quantity,
// 					Device_id: matchingItem.Device_id,
// 					Count_Status: matchingItem.Count_Status,
// 					Created_At: matchingItem.Created_At,
// 					Updated_At: matchingItem.Updated_At,
// 					Item_group: matchingItem.Item_group,
// 					Booked: item2.AVAIL_PHYSICAL,
// 					Variance: matchingItem.Quantity - item2.AVAIL_PHYSICAL,
// 					BUSINESSUNIT: matchingItem.BUSINESSUNIT,
// 					COSTCENTER: matchingItem.COSTCENTER,
// 					DEPARTMENT: matchingItem.DEPARTMENT,
// 					SITEF: matchingItem.SITEF,
// 					AYH_PRODUCTGROUP: matchingItem.AYH_PRODUCTGROUP,
// 					B20_PRODUCTGROUP: matchingItem.B20_PRODUCTGROUP,
// 				};
// 			} else {
// 				status = {
// 					UniqueCode: item2.UniqueKey,
// 					Header: item2.Header,
// 					Company: item2.COMP,
// 					Site: item2.SITE,
// 					CountType: '',
// 					ProductType: '',
// 					Transaction_Date: '',
// 					Warehouse: item2.WAREHOUSE,
// 					Counter_Name: '',
// 					Verifier_Name: '',
// 					Transaction_Number: '',
// 					Case_Barcode: item2.BARCODE,
// 					Item_Code: item2.ITEMID,
// 					Item_Description: item2.DESCRIPTION,
// 					Config: item2.CONFIGID,
// 					Size: item2.SIZE,
// 					Color: item2.COLOR,
// 					Style: item2.STYLE,
// 					Unique_Count: item2.Unique_Count,
// 					Original_ProductType: item2.Original_ProductType,
// 					ITEM_PER_SITE_WAREHOUSE: item2.ITEM_PER_SITE_WAREHOUSE,
// 					Item_Location: item2.LOCATION,
// 					Scanned_Location: '',
// 					Quantity: 0,
// 					Device_id: '',
// 					Count_Status: '',
// 					Created_At: '',
// 					Updated_At: '',
// 					Item_group: item2.ITEMGROUP,
// 					Booked: item2.AVAIL_PHYSICAL,
// 					Variance: 0 - item2.AVAIL_PHYSICAL,
// 					BUSINESSUNIT: '',
// 					COSTCENTER: '',
// 					DEPARTMENT: '',
// 					SITEF: '',
// 					AYH_PRODUCTGROUP: '',
// 					B20_PRODUCTGROUP: ''
// 				};
// 			}

// 			// Add the id and status to the variable array
// 			variable.push(status);
// 		});

// 		/**Check for duplicate then sum up the quantities */
// 		const resultData = Object.values(
// 			results3.reduce((accumulator, current) => {
// 			  const { UniqueCode, ...rest } = current;
		  
// 			  if (!accumulator[UniqueCode]) {
// 				accumulator[UniqueCode] = { UniqueCode, ...rest, Quantity: 0 };
// 			  }
		  
// 			  accumulator[UniqueCode].Quantity += current.Quantity;
		  
// 			  return accumulator;
// 			}, {})
// 		  );
		  

// 		//   console.log('results3',results3);
// 		//   console.log('resultData',resultData);

// 		/**Iterate the resultData to return new array of objects */
// 		const transformedResults = [];
// 		resultData.forEach((item2) => {
// 			const transformedItem = {
// 				UniqueCode: item2.UniqueCode,
// 				Header: item2.Header,
// 				Company: item2.Company,
// 				Site: item2.Site,
// 				CountType: item2.CountType,
// 				ProductType: item2.ProductType,
// 				Transaction_Date: item2.Transaction_Date,
// 				Warehouse: item2.Warehouse,
// 				Counter_Name: item2.Counter_Name,
// 				Verifier_Name: item2.Verifier_Name,
// 				Transaction_Number: item2.Transaction_Number,
// 				Case_Barcode: item2.Case_Barcode,
// 				Item_Code: item2.Item_Code,
// 				Item_Description: item2.Item_Description,
// 				Config: item2.Config,
// 				Size: item2.Size,
// 				Color: item2.Color,
// 				Style: item2.Style,
// 				Unique_Count: item2.Unique_Count,
// 				Original_ProductType: item2.Original_ProductType,
// 				ITEM_PER_SITE_WAREHOUSE: item2.ITEM_PER_SITE_WAREHOUSE,
// 				Item_Location: item2.Item_Location,
// 				Scanned_Location: item2.Scanned_Location,
// 				Quantity: item2.Quantity,
// 				Device_id: item2.Device_id,
// 				Count_Status: item2.Count_Status,
// 				Created_At: item2.Created_At,
// 				Updated_At: item2.Updated_At,
// 				Item_group: item2.Item_group,
// 				Booked: 0,
// 				Variance: item2.Quantity - 0,
// 				BUSINESSUNIT: item2.BUSINESSUNIT,
// 				COSTCENTER: item2.COSTCENTER,
// 				DEPARTMENT: item2.DEPARTMENT,
// 				SITEF: item2.SITEF,
// 				AYH_PRODUCTGROUP: item2.AYH_PRODUCTGROUP,
// 				B20_PRODUCTGROUP: item2.B20_PRODUCTGROUP
// 			};

// 			transformedResults.push(transformedItem);
// 		});
// 		const combinedD = [...variable, ...transformedResults];
// 		// console.log('Transformed Results', transformedResults);
// 		// console.log('results', combinedD);
// 		res.status(200).json(combinedD)

// 	} catch (error) {
// 		console.error('Error:', error);
// 		res.status(500).send('An error occurred while retrieving the products.');
// 	}
// };
const get_scanned_vs_on_hand = async (req, res) => {
	// console.log('get_scanned_vs_on_hand', req.query.activeComp)
	const database = 'physical_count';
	const database2 = 'physical_count_onhand';
	const activeComps = req.query.activeComp.split(',');

	// try {
	// 	const query = `
	// 	 SELECT *
	// 	  FROM ${database2} 
	// 	  WHERE ITEM_PER_SITE_WAREHOUSE = 'INT-00017MCBULFGWH01';
	// 	`;
	// 	const results = await executeQuery(query);
	// 	// res.status(200).json(results);
	// 	console.log('result',results)
	//   } catch (error) {
	// 	console.error('Error:', error);
	// 	res.status(500).send('An error occurred while retrieving the products.');
	//   }
	try {
		// const query = `
		//   SELECT 
		//   physical_count.UniqueCode, 
		// 	MAX(physical_count.Case_Barcode) AS Case_Barcode, 
		// 	MAX(physical_count.Color) AS Color, 
		// 	MAX(physical_count.Company) AS Company, 
		// 	MAX(physical_count.Config) AS Config, 
		// 	MAX(physical_count.CountType) AS CountType, 
		// 	MAX(physical_count.Count_Status) AS Count_Status, 
		// 	MAX(physical_count.Counter_Name) AS Counter_Name, 
		// 	MAX(physical_count.Created_At) AS Created_At, 
		// 	MAX(physical_count.Device_id) AS Device_id, 
		// 	MAX(physical_count.Header) AS Header, 
		// 	MAX(physical_count.Item_Code) AS Item_Code, 
		// 	MAX(physical_count.Item_Description) AS Item_Description, 
		// 	MAX(physical_count.Item_Location) AS Item_Location, 
		// 	MAX(physical_count.ProductType) AS ProductType, 
		// 	SUM(physical_count.Quantity) AS Quantity, 
		// 	MAX(physical_count.Scanned_Location) AS Scanned_Location, 
		// 	MAX(physical_count.Site) AS Site, 
		// 	MAX(physical_count.Size) AS Size, 
		// 	MAX(physical_count.Style) AS Style, 
		// 	MAX(physical_count.Transaction_Date) AS Transaction_Date, 
		// 	MAX(physical_count.Transaction_Number) AS Transaction_Number, 
		// 	MAX(physical_count.Updated_At) AS Updated_At, 
		// 	MAX(physical_count.Verifier_Name) AS Verifier_Name, 
		// 	MAX(physical_count.Warehouse) AS Warehouse, 
		// 	MAX(physical_count.id) AS id,
		// 	physical_count_onhand.AVAIL_PHYSICAL
		//   FROM ${database} AS physical_count
		//   LEFT JOIN physical_count_onhand AS physical_count_onhand ON physical_count.UniqueCode = physical_count_onhand.UniqueKey
		//   WHERE physical_count.Count_Status = 'Posted'
		//   GROUP BY physical_count.UniqueCode, physical_count_onhand.AVAIL_PHYSICAL
		// `;
		const query2 = `SELECT *
		FROM ${database2}
		WHERE Unique_Count IN (
			SELECT DISTINCT Unique_Count
			FROM ${database} WHERE Count_Status = 'Posted'
		);`;

		const query3 = `SELECT ${database}.*
			FROM ${database}
			LEFT JOIN ${database2} ON ${database}.UniqueCode = ${database2}.UniqueKey
			WHERE ${database2}.UniqueKey IS NULL and Count_Status = 'Posted'`;

		const query = `SELECT
		UniqueCode,
		MAX(Header) AS Header,
		MAX(Company) AS Company,
		MAX(Site) AS Site,
		MAX(CountType) AS CountType,
		MAX(ProductType) AS ProductType,
		MAX(Transaction_Date) AS Transaction_Date,
		MAX(Warehouse) AS Warehouse,
		MAX(Counter_Name) AS Counter_Name,
		MAX(Verifier_Name) AS Verifier_Name,
		MAX(Transaction_Number) AS Transaction_Number,
		MAX(Case_Barcode) AS Case_Barcode,
		MAX(Item_Code) AS Item_Code,
		MAX(Item_Description) AS Item_Description,
		MAX(Config) AS Config,
		MAX(Size) AS Size,
		MAX(Color) AS Color,
		MAX(Style) AS Style,
		MAX(ITEM_PER_SITE_WAREHOUSE) AS ITEM_PER_SITE_WAREHOUSE,
		MAX(Item_Location) AS Item_Location,
		MAX(Scanned_Location) AS Scanned_Location,
		SUM(Quantity) AS Quantity,
		MAX(Device_id) AS Device_id,
		MAX(Count_Status) AS Count_Status,
		MAX(Item_group) AS Item_group,


		MAX(BUSINESSUNIT) AS BUSINESSUNIT,
		MAX(COSTCENTER) AS COSTCENTER,
		MAX(DEPARTMENT) AS DEPARTMENT,
		MAX(SITEF) AS SITEF,
		MAX(AYH_PRODUCTGROUP) AS AYH_PRODUCTGROUP,
		MAX(B20_PRODUCTGROUP) AS B20_PRODUCTGROUP,

		MAX(Created_At) AS Created_At,
		MAX(Updated_At) AS Updated_At
	FROM ${database} WHERE Count_Status = 'Posted'
	GROUP BY UniqueCode;`;

		const results = await executeQuery(query);
		const results2 = await executeQuery(query2);
		const results3 = await executeQuery(query3);
		// console.log('query3',results3)
		const variable = [];


		results2.forEach((item2) => {
		
			// Initialize the status as an empty object
			let status = {};
			let matchingItem = [];
			if (item2.COMP === 'ayh') {
				// Find the matching item in results
				matchingItem = results.find((item1) => item1.UniqueCode === item2.UniqueKey);
			} else {
				matchingItem = results.find((item1) => item1.Case_Barcode === item2.BARCODE);
			}
			// Check if a matching item was found
			console.log('matchingItem', matchingItem)
			if (matchingItem) {
				// If a match is found, set the properties in the status object based on the matching item
				status = {
					UniqueCode: matchingItem.UniqueCode,
					Header: matchingItem.Header,
					Company: matchingItem.Company,
					Site: matchingItem.Site,
					CountType: matchingItem.CountType,
					ProductType: matchingItem.ProductType,
					Transaction_Date: matchingItem.Transaction_Date,
					Warehouse: matchingItem.Warehouse,
					Counter_Name: matchingItem.Counter_Name,
					Verifier_Name: matchingItem.Verifier_Name,
					Transaction_Number: matchingItem.Transaction_Number,
					Case_Barcode: matchingItem.Case_Barcode,
					Item_Code: matchingItem.Item_Code,
					Item_Description: matchingItem.Item_Description,
					Config: matchingItem.Config,
					Size: matchingItem.Size,
					Color: matchingItem.Color,
					Style: matchingItem.Style,
					Unique_Count: matchingItem.Style,
					Original_ProductType: matchingItem.Original_ProductType,
					ITEM_PER_SITE_WAREHOUSE: matchingItem.ITEM_PER_SITE_WAREHOUSE,
					Item_Location: matchingItem.Item_Location,
					Scanned_Location: matchingItem.Scanned_Location,
					Quantity: matchingItem.Quantity,
					Device_id: matchingItem.Device_id,
					Count_Status: matchingItem.Count_Status,
					Created_At: matchingItem.Created_At,
					Updated_At: matchingItem.Updated_At,
					Item_group: matchingItem.Item_group,
					Booked: item2.AVAIL_PHYSICAL,
					Variance: matchingItem.Quantity - item2.AVAIL_PHYSICAL,
					BUSINESSUNIT: matchingItem.BUSINESSUNIT,
					COSTCENTER: matchingItem.COSTCENTER,
					DEPARTMENT: matchingItem.DEPARTMENT,
					SITEF: matchingItem.SITEF,
					AYH_PRODUCTGROUP: matchingItem.AYH_PRODUCTGROUP,
					B20_PRODUCTGROUP: matchingItem.B20_PRODUCTGROUP,
					COSTPRICE: item2.COSTPRICE
				};
			} else {
				status = {
					UniqueCode: item2.UniqueKey,
					Header: item2.Header,
					Company: item2.COMP,
					Site: item2.SITE,
					CountType: '',
					ProductType: '',
					Transaction_Date: '',
					Warehouse: item2.WAREHOUSE,
					Counter_Name: '',
					Verifier_Name: '',
					Transaction_Number: '',
					Case_Barcode: item2.BARCODE,
					Item_Code: item2.ITEMID,
					Item_Description: item2.DESCRIPTION,
					Config: item2.CONFIGID,
					Size: item2.SIZE,
					Color: item2.COLOR,
					Style: item2.STYLE,
					Unique_Count: item2.Unique_Count,
					Original_ProductType: item2.Original_ProductType,
					ITEM_PER_SITE_WAREHOUSE: item2.ITEM_PER_SITE_WAREHOUSE,
					Item_Location: item2.LOCATION,
					Scanned_Location: '',
					Quantity: 0,
					Device_id: '',
					Count_Status: '',
					Created_At: '',
					Updated_At: '',
					Item_group: item2.ITEMGROUP,
					Booked: item2.AVAIL_PHYSICAL,
					Variance: 0 - item2.AVAIL_PHYSICAL,
					BUSINESSUNIT: '',
					COSTCENTER: '',
					DEPARTMENT: '',
					SITEF: '',
					AYH_PRODUCTGROUP: '',
					B20_PRODUCTGROUP: '',
					COSTPRICE: item2.COSTPRICE
				};
			}

			// Add the id and status to the variable array
			variable.push(status);
		});

		/**Check for duplicate then sum up the quantities */
		const resultData = Object.values(
			results3.reduce((accumulator, current) => {
			  const { UniqueCode, ...rest } = current;
		  
			  if (!accumulator[UniqueCode]) {
				accumulator[UniqueCode] = { UniqueCode, ...rest, Quantity: 0 };
			  }
		  
			  accumulator[UniqueCode].Quantity += current.Quantity;
		  
			  return accumulator;
			}, {})
		  );
		  

		//   console.log('results3',results3);
		//   console.log('resultData',resultData);

		/**Iterate the resultData to return new array of objects */
		const transformedResults = [];
		resultData.forEach((item2) => {
			const transformedItem = {
				UniqueCode: item2.UniqueCode,
				Header: item2.Header,
				Company: item2.Company,
				Site: item2.Site,
				CountType: item2.CountType,
				ProductType: item2.ProductType,
				Transaction_Date: item2.Transaction_Date,
				Warehouse: item2.Warehouse,
				Counter_Name: item2.Counter_Name,
				Verifier_Name: item2.Verifier_Name,
				Transaction_Number: item2.Transaction_Number,
				Case_Barcode: item2.Case_Barcode,
				Item_Code: item2.Item_Code,
				Item_Description: item2.Item_Description,
				Config: item2.Config,
				Size: item2.Size,
				Color: item2.Color,
				Style: item2.Style,
				Unique_Count: item2.Unique_Count,
				Original_ProductType: item2.Original_ProductType,
				ITEM_PER_SITE_WAREHOUSE: item2.ITEM_PER_SITE_WAREHOUSE,
				Item_Location: item2.Item_Location,
				Scanned_Location: item2.Scanned_Location,
				Quantity: item2.Quantity,
				Device_id: item2.Device_id,
				Count_Status: item2.Count_Status,
				Created_At: item2.Created_At,
				Updated_At: item2.Updated_At,
				Item_group: item2.Item_group,
				Booked: 0,
				Variance: item2.Quantity - 0,
				BUSINESSUNIT: item2.BUSINESSUNIT,
				COSTCENTER: item2.COSTCENTER,
				DEPARTMENT: item2.DEPARTMENT,
				SITEF: item2.SITEF,
				AYH_PRODUCTGROUP: item2.AYH_PRODUCTGROUP,
				B20_PRODUCTGROUP: item2.B20_PRODUCTGROUP,
				COSTPRICE: null
			};

			transformedResults.push(transformedItem);
		});
		const combinedD = [...variable, ...transformedResults];
		// console.log('Transformed Results', variable);
		// console.log('results', combinedD);
		res.status(200).json(combinedD)

	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('An error occurred while retrieving the products.');
	}
};



/**Sample Query generator */
const get_sample_query = (req, res) => {
	// console.log(req.query)
	// console.log('sample query')
	// const comp = req.query.Comp;
	// const site = req.query.site;
	const comp = 'ayh';
	// console.log(comp, site)
	poolConnect

		.then(() => {
			console.log('Connected to SQL Server');
			const request = new sql.Request(pool);

			// Query 1
			request.query(`select a.dataareaid as COMP,a.ITEMID,REPLACE(REPLACE(c.SEARCHNAME,CHAR(13),','),CHAR(10),',') as SERACHNAME,REPLACE(REPLACE(d.NAME,CHAR(13),','),CHAR(10),',') as NAME 
			,REPLACE(REPLACE(d.DESCRIPTION,CHAR(13),','),CHAR(10),',') as DESCRIPTION,b.CONFIGID,b.INVENTSIZEID as SIZE,b.INVENTCOLORID as COLOR,b.INVENTSTYLEID as STYLE 
			,b.INVENTSERIALID as BARCODE,b.INVENTSITEID as SITE,b.INVENTLOCATIONID as WAREHOUSE,b.WMSLOCATIONID as LOCATION,FORMAT(sum(a.AVAILPHYSICAL),'######.00') as AVAIL_PHYSICAL 
			,FORMAT(sum(a.ORDERED),'######.00') as ORDERED_inTotal,FORMAT(sum(a.ONORDER),'######.00') as OnORder 
			,format(sum(a.POSTEDVALUE),'#########.00')as FIN_COST_AMOUNT,format(case when isnull(sum(a.POSTEDVALUE),0)=0 or sum(a.POSTEDQTY)=0 then 0 else (sum(a.POSTEDVALUE)/sum(a.POSTEDQTY)) end,'#########.00') as COSTPRICE,FORMAT(k.PRICE,'######.00') as PURCH_PRICE 
			,g.NAME as PROD_CATEGORY,i.NAME as ITEMGROUP,j.LASTUPDATE 
			from INVENTSUM a
			left join INventdim b on a.inventdimid=b.inventdimid
			LEFT JOIN Ecoresproduct c on a.ITEMID=c.DISPLAYPRODUCTNUMBER 
			left join ECORESPRODUCTTRANSLATION d on c.RECID=d.PRODUCT  
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=0 and DATAAREAID='${comp}' ) e on a.itemid=e.ITEMID 
			Left join (select itemid,unitid,PRICE,DATAAREAID from INVENTTABLEMODULE where MODULETYPE=1 and DATAAREAID='${comp}' ) k on a.itemid=k.ITEMID 
			left join ECORESPRODUCTCATEGORY f on c.RECID=f.PRODUCT and f.CATEGORY<>0  
			left join  EcoResCategory g on f.CATEGORY=g.RECID 
			LEFT Join (select ITEMID,ITEMGROUPID from INVENTITEMGROUPITEM where ITEMGROUPDATAAREAID='${comp}') h on a.itemid=h.ITEMID 
			left join (Select ITEMGROUPID,NAME from INVENTITEMGROUP where DATAAREAID='${comp}') i on h.ITEMGROUPID=i.ITEMGROUPID 
			left join (Select ITEMID,max(LASTUPDDATEPHYSICAL) as LASTUPDATE from INVENTSUM group by ITEMID) j on a.ITEMID=j.ITEMID 
			where AVAILPHYSICAL != 0 and a.DATAAREAID='${comp}' --and b.INVENTSITEID='BA'
			group by a.dataareaid,a.itemid,c.SEARCHNAME,d.NAME,d.DESCRIPTION,b.configid,b.INVENTSIZEID,b.INVENTCOLORID,b.INVENTSTYLEID,b.INVENTSERIALID,b.INVENTSITEID,b.INVENTLOCATIONID,b.WMSLOCATIONID,e.PRICE,k.PRICE,g.NAME,i.NAME,j.LASTUPDATE,d.DESCRIPTION,a.POSTEDVALUE 
			order by a.DATAAREAID,b.INVENTLOCATIONID,a.ITEMID;`, (err1, result1) => {
				if (err1) {
					console.error('Error in Query 1:', err1);
					return res.status(500).json({ error: 'Database error in Query 1' });
				}

				// //   console.log('success combinedResults', result1.recordset)
				// // Create an empty Set to store unique ITEMGROUP values
				// const uniqueItemGroups = new Set();

				// // Iterate through the recordset to extract unique ITEMGROUP values
				// result1.recordset.forEach((record) => {
				// 	uniqueItemGroups.add(record.ITEMGROUP);
				// });

				// // Convert the Set to an array if needed
				// const uniqueItemGroupsArray = Array.from(uniqueItemGroups);

				// Now, uniqueItemGroupsArray contains the unique ITEMGROUP values
				// console.log(result1.recordset);
				res.status(200).json(result1.recordset);

			});
		})
		.catch((err) => {
			console.error('Error connecting to SQL Server:', err);
			res.status(500).json({ error: 'Database connection error' });
		});
};
module.exports = {
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
}