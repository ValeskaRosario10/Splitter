const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    to:{
        type:   mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    amount:{
        type:Number,
        required:true,
        min:0.01
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    },
    settledAt:{
        type:Date,
        default:Date.now
    }});
    module.exports=mongoose.model('Settlement',settlementSchema)