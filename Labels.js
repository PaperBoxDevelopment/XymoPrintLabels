

const axios = require('axios');
const fs = require('fs');
const QRCode = require("qrcode-svg");
const csvtojson = require("csvtojson");
const { jsPDF } = require("jspdf");
const svg2img = require('svg2img')
const multer = require('multer');             // Multer Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads') },
    filename: (req, file, cb) => {
        if (!file) { return }
        else { cb(null, file.fieldname) }
    }
})                                            // Multer Storage 
const upload = multer({ storage: storage })   // Multer Upload Variable
const timeOptions = {
    // weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: "numeric",
    dayPeriod: 'long',
    minute: 'numeric',
    timeZone: 'America/Toronto',
};


module.exports = async (app, dbs) => {



    const xymoOrders = dbs.collection("Xymo")

    /////////////////////////////////////////// TEST DONT USE IS JUST TESTING  ///////////////////////////////////////////

    let url = "https://approvals.xymoprint.com/portal.cgi/"
    let credentials = {
        'method': "auth.create_session",
        'user_name': 'admin',
        'user_pass': 'XYMO2020CF'
    }


    /* 
    {
      _id: '5ff3693a2f1100000b002f8c',  
      birth: '2021-01-04T19:15:06.000Z',
      type: 'item',
      state: 'Completed',
      name: 'I-003056',
      identifier: 'I-003056',
      description: 'Adrenal Manager 120c Labels CALIFORNIA',
      project_id: '23e650c5-3341-4584-88bd-6f23be2532ae',
      custom: {
        PurchaseOrder: '4500020787',
        SAPMaterial: '200003188',
        ProcessOrder: '',
        ItemDescription: 'Adrenal Manager 120c Labels CALIFORNIA',
        Quantity: '500',
        DueDate: '2021-01-18T00:00:00',
        PlasmaArtworkFile: 'http://xymonetOld/Plasma/getFile.ashx?fid=64129',
        ProductName: 'Adrenal Manager 120 C - California',
        FinishSize: '3 x 7.94',
        Substrate: 'White BOPP',
        Fingerprint: '064129-02 / CAL--ADMAN-02',
        LabelFinishing1: 'NONE',
        CoreSize: '',
        MadOD: '',
        UnwindDirection: '0',
        itemNum: '003056',
        revNum: 0,
        CreatedBy: 'System User',
        workOrderNum: '1697',
        CustomerName: 'XYMO Print',
        JobType: 'Labels',
        GeneralJobType: 'Label',
        CustomerEmail: '',
        WorkOrderType: 'Internal',
        SalesEmail: '',
        CSREmail: '',
        finalArtThumbnail: 'cloudflow://Jobs/Internal/1697/I-003056/Final%20Art/1697-003056.pdf',
        preview: 'cloudflow://Jobs/Internal/1697/I-003056/Final%20Art/1697-003056.pdf',    
        Press: 'HP Indigo 6800B',
        PressPriority: '3 - MEDIUM',
        steppedFileThumbnail: 'cloudflow://Jobs/Internal/1697/I-003056/Production%20Files/1697-003056-vdp_SR.pdf',
        Prepress: 'Melissa.Rye@xymoprint.com',
        datePrepressModified: '2021-01-08T14:38:42.000Z',
        hfHP6800B: 'file://10.10.7.78/hot_folders/XYMOQR/',
        proofNum: 0,
        Prints: 'NONE',
        LabelSubstrate: '',
        PrintSaveSamples: false,
        LabelFinishing2: 'NONE',
        MaxOD: '',
        Application: 'Please Select',
        LabelDie: '',
        around: '',
        CartonDieURL: '',
        Diecutting: 'NONE',
        VariableData: false,
        ClientNotes: '',
        InternalNotes: '',
        graphicDesigner: '',
        dateArtModified: null,
        CSRAuditor: '',
        dateAudited: null,
        ProdInstructions: '',
        ProdFrames: 46,
        ProdYield: 552,
        ProdQCApprover: 'Sebastian.Parra@xymoprint.com',
        ProdNotes: 'ePV/QR code, Barcode checked 01/11/21gy',
        ProdDate: '2021-01-11T16:31:32.000Z',
        FinishingInstructions: '',
        FinishingStartQuantity: 550,
        FinishingYield: 549,
        FinishingQC: 'Sebastian.Parra@xymoprint.com',
        FinishingNotes: '',
        FinishingDate: null,
        InspectionQC: '',
        InspectionNotes: '',
        InspectionDate: null,
        ShippingPerson: '',
        ShippingNotes: '',
        ShippingDate: null
      },
      calculations: {
        url: 'cloudflow://HY_APP/Scripts/ObjectCalculations/JobCalculations.js'
      },
      event_handler: { whitepaper: 'US-XYMOP eventHandler', input: 'Item Handler' },
      folders: [],
      parent_project_id: '74fb18b6-04a2-4005-8a73-aaedd48d8618',
      root_project_id: '74fb18b6-04a2-4005-8a73-aaedd48d8618',
      ui_handler: { whitepaper: 'US-XYMOP createProgram' },
      forms: { ListEdit: { name: 'ItemList' }, FormEdit: { name: 'ItemEdit' } },
      save_id: '9d1e90c6-4aeb-49bc-a7f8-4125345d9a24',
      modification: '2021-01-12T19:15:24Z',
      search: {
        extra_fields: {
          all_identifiers: [Array],
          all_descriptions: [Array],
          all_names: [Array],
          all_states: [Array],
          all_files: [Array],
          all_version_files: [Array]
        }
      },
      searchstring: 'i-003056 adrenal manager 120c labels california 1697 completed cloudflow://jobs/internal/1697/i-003056/final%20ai-003056/final%20art/1697-003056.pdf cloudflow://jobs/internal/1697/i-003056/final art/1697-003056.pdf cloudflo1697/i-003056/prodw://jobs/internal/1697/i-003056/production%20files/1697-003056-vdp_sr.pdf cloudflow://jobs/internal/1697/i-0030sr.pdf',56/production files/1697-003056-vdp_sr.pdf',
      files: [
        {
          url: 'cloudflow://Jobs/Internal/1697/I-003056/Final%20Art/1697-003056.pdf',
          tag: 'itemFinalArt'
        },
        {
          url: 'cloudflow://Jobs/Internal/1697/I-003056/Production%20Files/1697-003056-vdp_SR.pdf',
          tag: 'itemProductionFiles'
        }
      ],
      previews: [
        {
          file_url: 'cloudflow://Jobs/Internal/1697/I-003056/Production%20Files/1697-003056-vdp_SR.pdf',
          thumb_url: '/portal.cgi?thumbnail=getJPEG&id=E707AE14E7293E376A6A7200'
        }
      ],
      Finishing: ''
    } */


    app.get("/test", async (req, res) => {
        try {
            let token = await axios.post(url, credentials)
            let query = { 'session': token.data.session, "method": "job.list_with_options" }
            let getProject = await axios.post(url, query)
            console.log(getProject.data.results[1500]);
        } catch (error) { console.log(error); }

        res.send("test")
    })

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // XymoDataBase
    app.get("/atlas", (req, res, next) => {
        xymoOrders.find({}).toArray((err, docs) => {
            if (err) next(err)
            else res.json(docs)
        });
    })




    // Update Database
    app.post('/updateDatabase', upload.single('csv'), async (req, res, next) => {


        try {
            let dataBaseUpdateDate = {
                stamp: "stamp",
                date: new Intl.DateTimeFormat('en-US', timeOptions).format()
            }


            // console.log(req.file)
            let collections = await dbs.listCollections().toArray()
            // Check if specific Collection Exists
            let xymoCollection = await collections.filter(params => params.name === "Xymo")


            // @s This is How to read a CSV File with cvstojson and Upload It to the DataBase
            if (xymoCollection.length === 0) {
                csvtojson().fromFile(req.file.path).then(async (csvData) => {
                    await xymoOrders.insertMany(csvData)
                    await xymoOrders.insertOne(dataBaseUpdateDate)
                    req.flash("success_msg", "Database Updated !")
                    res.redirect('/')
                })
            } else {
                await xymoOrders.drop((err, result) => {
                    if (result) {
                        csvtojson().fromFile(req.file.path).then(async (csvData) => {
                            await xymoOrders.insertMany(csvData)
                            await xymoOrders.insertOne(dataBaseUpdateDate)
                            req.flash("success_msg", "Database Updated !")
                            res.redirect('/')
                        })
                    } else {
                        req.flash("error_msg", "No Database Updated!")
                        res.redirect('/')
                    }
                })
            }

        } catch (err) { next(err) }


    })


    // Create Labels from Page 

    /* FORM --- FROM --- TOP NAV BAR */

    /* USING --- REQ.QUERY --- */

    app.get('/labelCreator', async (req, res, next) => {

        try {
            let query = req.query.itemNumber.toUpperCase()
            let itemInformation = await xymoOrders.findOne({ 'Item #': query })

            // console.log(itemInformation)

            if (itemInformation) {

                let itemNumberShort = itemInformation['Item #'].slice(2)

                res.render('forms/labelCreator', {
                    itemNumberShort,
                    ...itemInformation
                })
            } else {
                req.flash("success_msg", "Try Again or Check Your Spelling")
                req.flash('error_msg', "Item Does Not Exist")
                res.redirect("/")
            }
        } catch (err) { next(err) }


    })




    // Create Labels From Item Link

    /* FROM LINK JOB PAGE  */

    /*  USING --- REQ.PARAMS ---  */


    app.get('/labelCreator/:Item', async (req, res, next) => {
        try {


            let query = req.params.Item.toUpperCase()
            let itemInformation = await xymoOrders.findOne({ 'Item #': query })

            if (itemInformation) {

                let itemNumberShort = itemInformation['Item #'].slice(2)

                res.render('forms/labelCreator', {
                    itemNumberShort,
                    ...itemInformation
                })
            } else {
                req.flash("success_msg", "Try Again or Check Your Spelling")
                req.flash('error_msg', "Item Does Not Exist")
                res.redirect("/")
            }
        } catch (err) { next(err) }


    })




    // Create Labels
    app.post('/createLabels', async (req, res, next) => {

        try {
            /////////////////////////  Work Order Info  /////////////////////////

            let Description = req.body.Description
            let ItemNumber = req.body.ItemNumber
            let SAPMaterial = req.body.SAPMaterial
            let svgQR = new QRCode({ content: SAPMaterial, join: true, width: 60, height: 60 }).svg()


            // Here you could use only QRCode to create a SVG image and remove the SVG2Image package
            // Use This QR code converter Only for PDFs
            svg2img(svgQR, { width: 600, height: 600, preserveAspectRatio: true }, function (error, buffer) {

                fs.writeFileSync('foo1.png', buffer)

                let image = fs.readFileSync('./foo1.png');

                /////////////////////////  Boxes Info  /////////////////////////

                let totalPieces = req.body.Quantity
                let quantityPerBox = req.body.quantityPerBox

                /////////////////////////  Calculations  /////////////////////////

                let boxesCalculation = totalPieces / quantityPerBox
                let totalBoxes = Math.floor(boxesCalculation) // use Math.floor Create Partial Box
                let partialBoxQuantity = totalPieces % quantityPerBox// use Reminder % Operator to Create Partial Box 
                let totalBoxesArray = new Array(totalBoxes)

                // console.log(Description);
                // console.log(ItemNumber);
                // console.log(SAPMaterial);
                // console.log(totalBoxes);
                // console.log(totalBoxesArray.length);
                // console.log(partialBoxQuantity);



                // JS PDF Settings
                let height = 1.5
                let width = 2
                let margin = .09


                const doc = new jsPDF({
                    orientation: "landscape",
                    unit: "in",
                    format: [height, width]
                });

                let descriptionToParagraph = doc.splitTextToSize(Description, (width - margin - margin));


                ////////////// Loop For Full Boxes //////////////////

                for (let index = 0; index < totalBoxesArray.length; index++) {
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text(descriptionToParagraph, width / 2, .25, { align: "center" });
                    // if (image) { doc.addImage(image, 'PNG', 1.37, .29, .55, .55); }
                    doc.setFont("helvetica", "normal");
                    doc.text(`WO#: ${ItemNumber}`, .09, .97)
                    doc.text(`SAP#: ${SAPMaterial}`, .09, 1.18)
                    doc.setFont("helvetica", "bold");
                    doc.text(`QTY: ${quantityPerBox}`, 1.1, 1.39)
                    doc.addPage([height, width], "l")
                }

                ////////////// Print Partial Box //////////////////

                if (partialBoxQuantity === 0) {

                } else {

                    doc.addPage([height, width], "l")
                    doc.setFont("helvetica", "bold");
                    doc.text(descriptionToParagraph, width / 2, .25, { align: "center" });
                    // if (image) { doc.addImage(image, 'PNG', 1.37, .29, .55, .55); }
                    doc.setFont("helvetica", "normal");
                    doc.text(`WO#: ${ItemNumber}`, .09, .97)
                    doc.text(`SAP#: ${SAPMaterial}`, .09, 1.18)
                    doc.setFont("helvetica", "bold");
                    doc.text(`QTY: PARTIAL ${partialBoxQuantity}`, .09, 1.39)

                }

                doc.save('labels.pdf')
                res.sendFile(__dirname + "/labels.pdf");
            });

        } catch (err) { next(err) }
    })


    return app

}