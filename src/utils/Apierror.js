class ApiError extends Error{
    constructor(statusCode,
        message="something went wrong",
        errors=[],
        stack=""){
            //overwrite karne ke liye super keyword use karte hai
            super(message)// isse parent class ko message mil jayega inheritance ke liye important hai
            this.statusCode=statusCode
            this.data=null
            this.message=message
            this.success=false
            this.errors=errors

            if(stack){
                this.stack=stack
            }else{
                Error.captureStackTrace(this,this.constructor)
            }
        }

       
}

 export {ApiError}



 // Example of the usage of this utitility in the code
 // if(!user){
//  throw new ApiError(404,"user not found");
// }