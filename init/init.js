const mongoose = require('mongoose');
const Stay = require('../models/Stay.js');
let inidata = require('./data.js');
async function main(){
   await mongoose.connect('');
}

main()
.then(()=>{
    console.log("database connected successfully");
})
.catch((err)=>{
    console.log(err);
});

async function init(){
    //await Stay.deleteMany({});
    inidata = inidata.data.map((obj)=>({...obj,owner: "id"}));
    await Stay.insertMany(inidata);
    console.log("successfull");
};

init();