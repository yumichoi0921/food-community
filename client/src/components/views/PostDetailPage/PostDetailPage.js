import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
// import { response } from 'express';
// import { Video } from '../../../../../server/models/Video';


function PostDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = {
        videoId: videoId
    }

    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        
        Axios.post('/api/post/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert("포스트 정보를 가져오기를 실패했습니다.")
                }
            })
    }, [])

    
    if(VideoDetail.writer) {
        return (
            <Row gutter = {[16, 16]}>
                <Col lg={18} xs={18}>
                    <div style={{ width: '100%', padding:'3rem 4em'}}>
                        {/* video */}
                        <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                        {/* user avatar */}
                        <List.Item 
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                // description={VideoDetail.description}
                            />
                        </List.Item>
                        <List.Item 
                            actions
                        >
                            <List.Item.Meta
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        
                        {/* comment */}
                        
    
                    </div>
                </Col>
                
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>...Loading</div>
        )
    }

    
}

export default PostDetailPage
