import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { category } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';


const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Posts, setPosts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        category: [],
        price: []
    })

    const [SearchTerm, setSearchTerm] = useState("")


    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getPosts(body)

    }, [])


    const getPosts = (body) => {
        Axios.post('/api/post/getPosts', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setPosts([...Posts, ...response.data.postInfo])
                    } else {
                        setPosts(response.data.postInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 포스트들을 가져오는데 실패 했습니다.")
                }
            })
    }


    const loadMoreHandler = () => {

        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }

        getPosts(body)
        setSkip(skip)
    }


    const renderCards = Posts.map((post, index) => {

        var minutes = Math.floor(post.duration / 60);
        var seconds = Math.floor(post.duration - minutes * 60);


        return <Col lg={6} md={8} xs={24}>
            <Card
                cover={<a href={`/post/${post._id}`}> <ImageSlider images={post.images} /> </a>}
            >
                <a href={`/post/${post._id}`}>
                    <Meta
                        title={post.title}
                        // avatar={
                        //     <Avatar src={post.writer.image} />
                        // }
                        description={post.writer.name}
                    />
                </a>
                <div class="detail" style={{ textAlign: 'right' }}>
                    <span style={{ marginLeft: '3rem' }}>views {post.views}</span> <br />
                    <span> {moment(post.createdAt).format("MMM Do YY")} </span>
                </div>
            </Card>
        </Col>
    })


    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getPosts(body)
        setSkip(0)

    }


    const handleFilters = (filters, categories) => {

        const newFilters = { ...Filters }

        newFilters[categories] = filters

        console.log('filters', filters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
       
        setSearchTerm(newSearchTerm)

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getPosts(body)
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} > Recipe </Title>
                <hr />
            </div>

            {/* check box */}
            <CheckBox list={category} handleFilters={filters => handleFilters(filters, "category")} />

            {/* search  */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature
                    refreshFunction={updateSearchTerm} />
            </div>

            {/* cards */}
            <Row gutter={16, 10}>
                {renderCards}
            </Row>

            {/* 더보기 */}
            <br />
            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }

        </div>
    )



}

export default LandingPage
