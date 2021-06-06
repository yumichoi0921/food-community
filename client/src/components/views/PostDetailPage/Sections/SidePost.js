import React, {useEffect, useState} from 'react'
import Axios from 'axios';


function SidePost() {

    const [SidePosts, setSidePosts] = useState([])

    useEffect(() => {
        Axios.get('/api/post/getPosts')
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.postInfo)
                    setSidePosts(response.data.postInfo)
                } else {
                    alert('게시물 가져오기를 실패했습니다.')
                }
            } )
    }, [])

    const renderSidePost = SidePosts.map((post, index) => {
        
        // var minutes = Math.floor(post.duration / 60);
        // var seconds = Math.floor(post.duration - minutes * 60);
        
        return <div key = {index} style={{ display: 'flex', marginBottom: "1rem", padding: "0 2rem"}}>
            <div style={{width: '40%', marginRight: "1rem"}}>
                <a href={`/post/${post._id}`}>
                <img style={{ width: '100%', height: '100%' }} src={`http://localhost:5000/${post.images[0]}`} alt="thumbnail" />
                </a>
            </div>

            <div style={{width: "100%"}}>
                <a href={`/post/${post.id}`} style={{color: 'gray'}}>
                    <span style={{fontsize: '1rem', color: 'black'}}>{post.title}</span><br />
                    <span>{post.writer.name}</span><br />
                    <span>{post.views} views</span><br />
                    {/* <span>{minutes} : {seconds}</span><br /> */}
                </a>
            </div>
        </div>
    })

    return (
        <React.Fragment>
            <div style={{ marginTop:'3rem' }}></div>
            {renderSidePost}
        </React.Fragment>
    )




}

export default SidePost
