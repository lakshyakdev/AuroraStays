const mongoose = require('mongoose');

const Review = require('./review');
const { ref } = require('joi');

const StaySchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
    title : {
        type: String,
        required: true,
    },
    description: {
        type: String,
       required: true,
    },
    image:{
        filename:{
            type:String,
            dafault: "Property Image",
            set : (v)=> v==="" ?"Property Image":v,
        },
        url:{
            type:String,
            default:"https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set : (v)=> v==="" ?"https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        },  
    },
    price:{
        type: Number,
        required: true,
    },
    location:{
        type:String,
        required: true,
    } ,
    country:{
        type:String,
        required: true,
    } ,
    reviews :[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
});

StaySchema.post("findOneAndDelete" ,async (stay)=>{
    if(stay){
        await Review.deleteMany( {_id: {$in: stay.reviews}});
    }
})

const Stay = mongoose.model("Stay",StaySchema);
module.exports = Stay;
