import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
    const [Posts, setPosts] = useState([])

    useEffect(() => {

        const subscriptionVariables = {
            userFrom : localStorage.getItem('userId')
        }


        Axios.post('/api/post/getSubscriptionPosts', subscriptionVariables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.posts)
                    setPosts(response.data.posts)

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
                <img style={{ width: '100%' }} src={`http://localhost:5000/${post.images[0]}`} alt="thumbnail"/>
                <div className=" duration"
                    style={{ bottom: 0, right:0, position: 'absolute', margin: '4px', 
                    color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                    padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                    fontWeight:'500', lineHeight:'12px' }}>
                    <span>{minutes} : {seconds}</span>
                </div>
                </a>
                
            </div><br />
            <Meta
                avatar={
                    <Avatar src={post.writer.image} />
                }
                title={post.title}
            />
            <span>{post.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {post.views}</span>
            <span> {moment(post.createdAt).format("MMM Do YY")} </span>
        </Col>

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recipe </Title>
            <hr />

            <Row gutter={16}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage
