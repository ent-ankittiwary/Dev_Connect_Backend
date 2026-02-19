const validateSignUpData =(req)=>{
    const {name,age,photoUrl,email,password}=req.body;
    if(!name || ! age || !email || ! password ){
        throw new Error("Some feild are missing");
    }
    if(age<18){
        throw new Error("Age must be greater than 18");
    }
    if(!photoUrl){
        throw new Error("Missing Photo Url");
    }
}
module.exports ={validateSignUpData};