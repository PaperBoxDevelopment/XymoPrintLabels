

const _ = require("lodash");
const QRCode = require("qrcode-svg");
const timeOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: "numeric",
    minute: 'numeric',
    timeZone: 'America/Toronto',
    // timeZoneName: 'long'
};


module.exports = async (app, dbs) => {


    const xymoOrders = dbs.collection("Xymo")


    // Index
    app.get('/', async (req, res, next) => {




        req.user ? console.log(`----------------- ${req.user.name} is Logged In -----------------`) : console.log('-----------------  No user is Logged In  -----------------');


        try {
            let updateStamp = await xymoOrders.findOne({ stamp: "stamp" })
            // console.log(updateStamp);

            let items = await xymoOrders.aggregate([

                { $match: { "Status": { $ne: "Scheduling" } } },
                { $sort: { "Status": 1 } },
                {
                    $addFields: {

                        WorkOrderNumber: {
                            $convert: {
                                input: "$Work Order #",
                                to: "int",
                                onError: { $concat: ["Could not convert ", { $toString: "$Work Order #" }, " to type integer."] },
                                onNull: "Input was null or empty"
                            }
                        },
                        items: []

                    }
                }

            ]).toArray()



            ////////////////////   Concatenate Same Items Order Numbers / Remove Duplicates From Array of Objects /////////////////////////////////////////////////

            let orders = await items.reduce((previous, current) => {
                var object = previous.filter(object => object["Work Order #"] === current["Work Order #"]);
                if (object.length == 0) { previous.push(current) }
                return previous
            }, []);

            /////////////////////////////////////////////////////////// Add/Push Items to Corresponding Orders /////////////////////////////////////////////////

            try { orders.map((loopOrders) => { items.map((loopItems) => { if (_.isEqual(loopItems.WorkOrderNumber, loopOrders.WorkOrderNumber)) { loopOrders.items.push(loopItems) } }) }) }
            catch (err) { next(err) }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




            let stringDateCreated = await orders.filter(order => typeof order["Date Created"] === 'string')
            let ordersFilter = await stringDateCreated.filter((order) => { return Number(order['Date Created'].slice(0, 4)) >= 2022 })
            let internal = await ordersFilter.filter(order => order["Work Order Type"] === "Internal")/* .sort((a, b) => parseFloat(b.WorkOrderNumber) - parseFloat(a.WorkOrderNumber)); */
            let external = await ordersFilter.filter(order => order["Work Order Type"] === "External")/* .sort((a, b) => parseFloat(b.WorkOrderNumber) - parseFloat(a.WorkOrderNumber)); */

            res.render('index', {
                order: ordersFilter,
                internal: internal,
                external: external,
                updateStamp: updateStamp.date,
                todaysDate: new Intl.DateTimeFormat('en-US', timeOptions).format()
                // date: posted(updateStamp.date),
                // hour: updateStamp.hour

            })
        } catch (err) { next(err) }
    })



    // Show Only By Status
    app.get('/showOnly', async (req, res, next) => {


        try {

            let department = req.query.showOnly

            let items = await xymoOrders.aggregate([

                { $match: { "Status": req.query.showOnly } },
                { $sort: { 'Work Order #': -1 } },
                {
                    $addFields: {

                        WorkOrderNumber: {
                            $convert: {
                                input: "$Work Order #",
                                to: "int",
                                onError: { $concat: ["Could not convert ", { $toString: "$Work Order #" }, " to type integer."] },
                                onNull: "Input was null or empty"
                            }
                        },
                        items: []
                    }
                }


            ]).toArray()

            // console.log(items);



            //  @s Concatenate Same Order Numbers Remove Duplicates From Array of Objects

            let orders = await items.reduce((previous, current) => {
                var object = previous.filter(object => object["Work Order #"] === current["Work Order #"]);
                if (object.length == 0) { previous.push(current) }
                return previous
            }, []);


            orders.map((loopOrders) => { items.map((loopItems) => { if (_.isEqual(loopItems.WorkOrderNumber, loopOrders.WorkOrderNumber)) { loopOrders.items.push(loopItems) } }) })


            let stringDateCreated = await orders.filter(order => typeof order["Date Created"] === 'string')
            let ordersFilter = await stringDateCreated.filter((order) => { return Number(order['Date Created'].slice(0, 4)) >= 2022 })
            let internal = ordersFilter.filter(params => params["Work Order Type"] === "Internal")/* .sort((a, b) => parseFloat(b.WorkOrderNumber) - parseFloat(a.WorkOrderNumber)); */
            let external = ordersFilter.filter(params => params["Work Order Type"] === "External")/* .sort((a, b) => parseFloat(b.WorkOrderNumber) - parseFloat(a.WorkOrderNumber)); */


            res.render('forms/showOnly', {
                department: department,
                order: ordersFilter,
                internal: internal,
                external: external,
                todaysDate: new Intl.DateTimeFormat('en-US', timeOptions).format()
            })


        } catch (err) { next(err) }
    })



    // Order Page
    app.get('/order/:orderNumber', async (req, res, next) => {

        try {

            let orderNumber = req.params.orderNumber
            let items = await xymoOrders.aggregate([{ $match: { "Work Order #": orderNumber } }]).toArray()
            let order = items[0]
            let itemsWithQRCode = items.map((item) => ({ ...item, QRCode: new QRCode({ content: "WO-" + item["Work Order #"].toString() + ' Item-' + item['Item #'].toString() + " Qty-" + item.Quantity.toString(), join: true, width: 75, height: 75 }).svg() }))

            res.render('forms/order', { items: itemsWithQRCode, ...order })


        } catch (err) { next(err) }
    })

    

    // Test Errors
    app.get('/handleErrors', async (req, res, next) => {

        setTimeout(() => {
            try { throw new Error("Thrown Error") }
            catch (err) { next(err) }
        }, 100)


    })




    /*  Database Example
    {
  _id: 61e9bae1f5bb7d001691fca4,
  'Item #': 'I-004743-32',
  Description: 'Business Cards (staff)',
  'Date Created': '2021-06-25',
  'Due Date': '2021-06-30',
  'Work Order #': '6142',
  'Work Order Type': 'Internal',
  Status: 'Shipping',
  'Customer Name': 'XYMO Print',
  SAPMaterial: '300081286',
  Press: 'HP Indigo 7900',
  'Press Priority': '3 - MEDIUM',
  CSR: 'Edward.Aponte@xymoprint.com',
  'Sales Order': '',
  Quantity: '500'
}
 */




    /* Status Array
        [
        Press,
        Out for Approval,
        Shipping,
        Assign CSR,
        Inspection,
        Press,
        FoldGlue,
        Die Cutting,
        Finishing,
        Prepress,
        Proofing,
        ] 
    */

    return app
};
