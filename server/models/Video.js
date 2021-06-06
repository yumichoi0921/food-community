const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const videoSchema = mongoose.Schema({
   
    writer: {
        // Id로 User 모델의 모든 정보 사용
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    filePath: {
        type: String
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    },
    images: {
        type: Array,
        default: []
    }
}, { timestamps: true }) // 생성된 날짜와 수정된 날짜 저장




const Video  = mongoose.model('Video', videoSchema);

module.exports = { Video  }