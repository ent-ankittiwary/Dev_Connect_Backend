const customer = require("../model/customer");
const isPasswordHashed = (pwd)=>{
    return pwd.startsWith("$2b$") || pwd.startsWith("$2a$") || pwd.startsWith("$2y$");
}
const revalidate = async () => {
  try {
    const customers = await customer.find();
    console.log(customers.length);
    for (let c of customers) {
      try {
        //for each c document check is password hashed or not
        if(!isPasswordHashed(c.password)){
            throw new Error("Password is not hashed with id "+ c._id);
        }
          await c.validate();
          console.log("VALID", c._id);
        }
       catch (err) {
        console.log(err.message);
        throw err // stop on first invalid document;
      }
    }
    console.log("Revalidation completed");
  }
   catch (err) {
    console.log("Revalidation failed "+ err.message);
    throw err;
  }
};

module.exports = revalidate;
