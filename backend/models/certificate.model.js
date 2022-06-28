const mongoose = require('mongoose');
const truffle_connect = require("../utils/connection");
const Schema = mongoose.Schema;

truffle_connect.connectWeb3();


const certificateSchema = new Schema({
    _id: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    modules: { type: Array, required:true },
    txhash: { type: String }
}, {
    timestamps: true,
}, {
    _id: false,
}
);

certificateSchema.methods.deployBlockchain = function(){
    const data = this;
    const certificateId = data._id.toString()

    const { user, modules } = data;


    return truffle_connect.generateCertificate(
        certificateId,
        user.name,
        user.studId,
        "Tunku Abdul Rahman University College",
        modules,
        100
    );
}

certificateSchema.methods.getData = function(){
    const data = this;
    const certificateId = data._id.toString()

    const { user, modules } = data;


    return truffle_connect.getCertificateData(certificateId);
}


const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;