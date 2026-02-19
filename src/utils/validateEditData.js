const validateEditData =(req)=>{
        const {name,age,photoUrl,gender,about,skills,email,password}=req.body;
        if(!name || !age || !photoUrl){
            throw new Error("Some feilds are missing or invalid");
        }
        if(age<18){
            throw new Error("Age must be greater than 18");
        }

}
    module.exports = {validateEditData};