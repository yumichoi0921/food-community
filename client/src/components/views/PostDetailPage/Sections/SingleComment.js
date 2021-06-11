import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { responsiveMap } from 'antd/lib/_util/responsiveObserve';
import LikeDislikes from './LikeDislikes';
// import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;


function SingleComment(props) {

    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글을 저장하지 못했습니다.')
                }
            })

    }

    const actions = [
        <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to</span>
    ]
   
   
   
   
    return (
        <div>
            {props.comment.writer && (
                <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p> {props.comment.content}</p>}
                />
            )}

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</Button>
                </form>
            }

            
        </div>
    )
}

export default SingleComment
