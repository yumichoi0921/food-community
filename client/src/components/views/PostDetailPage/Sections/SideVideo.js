import React, {useEffect, useState} from 'react'
import Axios from 'axios';


function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(() => {
        Axios.get('/api/post/getVideos')
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.videos)
                    setsideVideos(response.data.videos)
                } else {
                    alert('게시물 가져오기를 실패했습니다.')
                }
            } )
    }, [])

    const renderSideVideo = sideVideos.map((video, index) => {
        
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
        
        return <div key = {index} style={{ display: 'flex', marginBottom: "1rem", padding: "0 2rem"}}>
            <div style={{width: '40%', marginRight: "1rem"}}>
                <a href={`/post/${video._id}`}>
                <img style={{ width: '100%', height: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>

            <div style={{width: "100%"}}>
                <a href={`/post/${video.id}`} style={{color: 'gray'}}>
                    <span style={{fontsize: '1rem', color: 'black'}}>{video.title}</span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views</span><br />
                    <span>{minutes} : {seconds}</span><br />
                </a>
            </div>
        </div>
    })

    return (
        <React.Fragment>
            <div style={{ marginTop:'3rem' }}></div>
            {renderSideVideo}
        </React.Fragment>
    )




}

export default SideVideo
