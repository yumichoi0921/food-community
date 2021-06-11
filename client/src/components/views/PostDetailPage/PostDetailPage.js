import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col, Typography, Divider } from 'antd';
import Axios from 'axios';
import PostImage from './Sections/PostImage';
import PostInfo from './Sections/PostInfo';
import SidePost from './Sections/SidePost';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes';
import ReactHtmlParser from 'react-html-parser';

const { Title, Paragraph } = Typography;

function PostDetailPage(props) {

    const postId = props.match.params.postId
    const [PostDetail, setPostDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const variable = {
        postId: postId
    }

    useEffect(() => {

        Axios.post('/api/post/getPostDetail', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.postDetail)
                    setPostDetail(response.data.postDetail)
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

    if (PostDetail.writer) {

        const subscribeButton = PostDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={PostDetail.writer._id} userFrom={localStorage.getItem('userId')} />;

        return (
            <div style={{ width: '100%', padding: '3rem 4em' }}>
                {/* post title */}
                <Title style={{ textAlign: 'center' }}>{PostDetail.title}</Title>
                <Row gutter={[16, 16]}>
                    <Col lg={16} xs={24}>
                        {/* post image */}
                        <PostImage detail={PostDetail} />

                        {/* video */}
                        <div>
                            {PostDetail.filePath && (<video style={{ width: '100%' }} src={`http://localhost:5000/${PostDetail.filePath}`} controls />)}
                        </div>

                        {/* likes or dislikes, subscribe */}
                        <List.Item
                            actions={[<LikeDislikes post postId={postId} userId={localStorage.getItem('userId')}  />, subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={PostDetail.writer.image} />}
                                title={PostDetail.writer.name}
                            />
                        </List.Item>

                        {/* description */}
                        <Divider />
                        <Paragraph>{ReactHtmlParser(PostDetail.description)}</Paragraph>

                        {/* comment */}
                        <Divider />
                        <Comment refreshFunction={refreshFunction} CommentLists={CommentLists} postId={PostDetail._id} />
                    </Col>

                    <Col lg={8} xs={24}>
                        <SidePost />
                    </Col>
                </Row>
            </div>
        )
    } else {
        return (
            <div>...Loading</div>
        )
    }
}

export default PostDetailPage