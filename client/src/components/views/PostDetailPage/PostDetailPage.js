import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar, Typography, Divider } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

const { Title, Paragraph } = Typography;

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

        const subscribeButton =  VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />;
       
        return (
            <Row gutter = {[16, 16]}>
                <Col lg={16} xs={24}>
                    <div style={{ width: '100%', padding:'3rem 4em'}}>
                        {/* video title */}
                        <Title style = {{ textAlign: 'center'}}>{VideoDetail.title}</Title>
                        {/* video */}
                        <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                        {/* user avatar */}
                        <List.Item 
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                 avatar={<Avatar src={VideoDetail.writer.image} />}
                                 title={VideoDetail.writer.name}
                            />
                        </List.Item>
                        {/* description */}
                        <Divider />
                        <Paragraph>{VideoDetail.description}</Paragraph>
                        {/* comment */}
                        <Divider />
                        <Comment postId={VideoDetail._id}/>
                        
    
                    </div>
                </Col>
                
                <Col lg={8} xs={24}>
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
