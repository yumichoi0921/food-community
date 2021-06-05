import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col, Typography, Divider} from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment'
// import LikeDislikes from './Sections/LikeDislikes';

const { Title, Paragraph } = Typography;

function PostDetailPage(props) {


    const videoId = props.match.params.videoId
    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const variable = {
        videoId: videoId
    }

    useEffect(() => {

        Axios.post('/api/post/getVideoDetail', variable)
        .then(response => {
            if (response.data.success) {
                console.log(response.data.videoDetail)
                setVideoDetail(response.data.videoDetail)
            } else {
                alert('포스트 정보 가져오기를 실패했습니다.')
            }
        })

            Axios.post('/api/comment/getComments', variable)
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data.comments)
                        setCommentLists(response.data.comments)
                    } else {
                        alert("댓글 정보 가져오기를 실패했습니다.")
                    }
                })
    }, [])

    const refreshFunction = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }
    
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
                        {/* videoId -> VideoDetail._id */}
                        <Comment refreshFunction={refreshFunction} CommentLists={CommentLists} postId={VideoDetail._id}/>
                                               
    
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