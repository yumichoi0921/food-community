import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import ImageSlider from '../../utils/ImageSlider';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Posts, setPosts] = useState([])

    useEffect(() => {
        Axios.get('/api/post/getPosts')
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.postInfo)
                    setPosts(response.data.postInfo)

                } else {
                    alert('게시물 가져오기를 실패했습니다.')
                }
            } )
    }, [])

    const renderCards = Posts.map((post, index) => {
       
        var minutes = Math.floor(post.duration / 60);
        var seconds = Math.floor(post.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>
            <div style={{ position: 'relative' }}>
                <a href={`/post/${post._id}`} >
                    <Card
                        cover={<ImageSlider images={post.images} />}
                    >
                        <Meta
                            avatar={
                                <Avatar src={post.writer.image} />
                            }
                            title={post.title}
                        />
                        <span>{post.writer.name} </span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ marginLeft: '3rem' }}>views {post.views}</span> <br />
                            <span> {moment(post.createdAt).format("MMM Do YY")} </span>
                        </div>
                    </Card>
                </a>
            </div>
        </Col>

        // return <Col lg={6} md={8} xs={24}>
        //     <div style={{ position: 'relative' }}>
        //         <a href={`/post/${post._id}`} >
        //             <img style={{ width: '100%' }} src={`http://localhost:5000/${post.thumbnail}`} alt="thumbnail" />
        //             <div className=" duration"
        //                 style={{
        //                     bottom: 0, right: 0, position: 'absolute', margin: '4px',
        //                     color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
        //                     padding: '2px 4px', borderRadius: '2px', letterSpacing: '0.5px', fontSize: '12px',
        //                     fontWeight: '500', lineHeight: '12px'
        //                 }}>
        //                 <span>{minutes} : {seconds}</span>
        //             </div>
        //         </a>
        //     </div>
        //     <br />
        //     <Meta
        //         avatar={
        //             <Avatar src={post.writer.image} />
        //         }
        //         title={post.title}
        //     />
        //     <span>{post.writer.name} </span><br />
        //     <span style={{ marginLeft: '3rem' }}> {post.views}</span>
        //     <span> {moment(post.createdAt).format("MMM Do YY")} </span>
        // </Col>

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > Recipe </Title>
                <hr />
            </div>

            <Row gutter={16, 16}>
                {renderCards}
            </Row>
        </div>
    )
   
   

}

export default LandingPage
