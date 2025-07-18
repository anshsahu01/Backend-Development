// const asyncHandler=()=>{}


// const asyncHanlder=()=>{}

// const asyncHandler=()=>{()=>{}}//iskko hi hum jo niche wali line mein likha hai vaise likh denge
// const asyncHandler=()=>()=>{}


    //ab is function ko async banana ho
    

    // YAHAN PER HUMNE TRY CATCH KE SAATH KIYA AB KUCHH CODE BASE MEIN PROMISE KE SAATH LIKHA HOTA HAI



    // const asyncHandler=(requestHandler)=>{

    //     (req,res,next)=>{
    //         Promise.resolve(requestHandler(req,res,next)).
    //         catch((err)=>next(err))
    //     }

    // }


    const asyncHandler =(fn)=>async (req,res,next)=>{
        try {
           return await fn(req,res,next);

            
        } catch (error) {
            res.status(error.code||500).json({
                success:false,
                message:error.message,
                })
            
        }
    }

    export {asyncHandler}
