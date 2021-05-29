const express = require('express');
const router = express.Router();
const { Video  } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require('fluent-ffmpeg');


var storage = multer.diskStorage({
    // 파일을 저장할 장소->uploads 폴더에 저장
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    // 파일 저장시 어떤 이름으로 저장할 것인지->현재날짜_파일이름
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    // 파일형식->mp4
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file");


//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {

    // 비디오를 서버에 저장한다.   
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});


router.post("/getVideoDetail", (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, videoDetail })
    })
});


router.post("/uploadVideo", (req, res) => {

    // 비디오 정보들을 서버에 저장한다.

    // 모든 variables를 다 가져온다.
    const video  = new Video(req.body)
    // 몽고DB에 저장
    video.save((err, doc) => {
        if(err) return res.jso({ success: false, err })
        res.status(200).json({ success: true })
    })

});


router.get("/getVideos", (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

    // 모든 비디오를 가져온다.
    Video.find()
        // writer의 모든 정보 가져오기
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })



  

});



router.post("/thumbnail", (req, res) => {

    // 썸네일을 생성하고 비디오 러닝타임을 가져온다

    let thumbsFilePath ="";
    let fileDuration ="";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);  // all metadata
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.filePath)   // 비디오 저장 경로
        // 비디오 썸네일 파일 이름 생성
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        // 썸네일 생성 후
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        // 에러 발생 시
        .on('error', function(err) {
            console.console.error((err));   
            return res.json({ success: false, err });
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

});



module.exports = router;