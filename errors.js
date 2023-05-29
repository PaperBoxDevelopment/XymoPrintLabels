module.exports = {


    // Main Error Handler Used In app.js


    errorHandler: (err, req, res, next) => {

        // console.log(err);
        // console.log(err.stack);
        // console.log(err.message);
        // console.log(err.code);

        req.flash('error_msg', err.message)
        res.redirect("/")
        next(err)
    },


//////////////////////////////////////////////////////////////////////////////////////////////////////////////





    /* ------------------  Different Async Wrappers for Sending Errors  ---------------------- */

    // This Wrapper is more suitable for Express Js. because it works with promises

    promiseWrapper: fn => {
        return (req, res, next) => {
            fn(req, res, next).catch(next)
        }
    },



    // Async functions and async methods always return a Promise, either resolved or rejected.
    // This Wrapper does Not Send Errors Next() to error Handler

    tryCatchWrapper1: fn => {
        return async () => {
            try { return await fn.apply(this, arguments) }
            catch (e) { customErrorHandler(e) }
        }
    },



    /*      
        
    Need to Try This one since It is suitable for MongoDB and Send Error to Next()
    and can be handled by the errorHandler function 
             
    */


    // this One is using Try/Catch for MongoDB Operations and Sends Errors to Next() to errorHandler

    tryCatchWrapper2: (fn) => {
        return async function wrappedFn(req, res, next) {
            try { await fn(req, res) }
            catch (err) { next(err) }
        };
    }
}