const validateSignUpData =(req)=>{
    const {name,age,photoUrl,gender,email,password}=req.body;
    if(!name){
        throw new Error("name is missing");
    }
    if(!age){
        throw new Error("age is missing");
    }
    if(age<18){
        throw new Error("Age must be greater than 18");
    }
    if(!gender){
        throw new Error("gender is not selected");
    }
    if(!photoUrl){
        throw new Error("photoUrl is missing");

    }

    if(!email){
        throw new Error("Email is missing");

    }
    if(!password){
        throw new Error("Password is missing");
    }
    
}
module.exports ={validateSignUpData};