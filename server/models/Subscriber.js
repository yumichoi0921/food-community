const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const subscriberSchema = mongoose.Schema({
   userTo: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   userFrom: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   }
}, { timestamps: true }) // 생성된 날짜와 수정된 날짜 저장




const Subscriber  = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }