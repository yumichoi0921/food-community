import React, { useState } from 'react';
// import Dropzone from 'react-dropzone';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
// import Item from 'antd/lib/list/Item';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './Sections/UploadPage.css';
import FileUpload from '../../utils/FileUpload';


const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const CategoryOptions = [
    { key: 1, label: "Main Food" },
    { key: 2, label: "Side Food" },
    { key: 3, label: "Desert" }
]

function UploadPage(props) {
    const user = useSelector(state => state.user);
    const [PostTitle, setPostTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState(1)
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    const [Images, setImages] = useState([])

    const onTitleChange = (e) => {
        setPostTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setDescription(data)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const updateFilePath = (newFilePath) => {
        setFilePath(newFilePath)
    }

    const updatThumbnail = (newDuration, newThumbnailPath) => {
        setDuration(newDuration)
        setThumbnailPath(newThumbnailPath)
    }


    const onSubmitHandler = (e) => {
        // 이벤트 발생을 막음(이벤트 고유 동작을 중단시킴)
        e.preventDefault();

        if (!Images || !PostTitle || !Description || !Private || !Category) {
            return alert("대표 이미지, 제목, 설명, 공개 범위, 카테고리를 입력해주세요.")
        }

        // 서버에 있는 값을 request로 보냄.
        const variables = {
            // 로그인된 사람의 아이디
            writer: user.userData._id,
            title: PostTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,
            images: Images
        }

        Axios.post('/api/post/uploadfiles', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    message.success('성공적으로 업로드를 했습니다.')

                    setTimeout(() => {

                    }, 3000);
                    props.history.push('/')
                } else {
                    alert('업로드를 실패했습니다')
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload</Title>
            </div>

            <Form onSubmit={onSubmitHandler}>
                {/* file upload zone */}
                <FileUpload ImageRefreshFunction={updateImages} FilePathRefreshFunction={updateFilePath} ThumbnailRefreshFunction={updatThumbnail} />

                <br />
                <br />

                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={PostTitle}
                />
                <br />
                <br />

                <label>Descrption</label>
                <CKEditor
                    editor={ClassicEditor}
                    data="<p>Hello from CKEditor 5!</p>"
                    onChange={onDescriptionChange}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map(item => (
                        <option key={item.key} value={item.key}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="Primary" size="large" onClick={onSubmitHandler}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default UploadPage
