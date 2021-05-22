import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Item from 'antd/lib/list/Item';
import Axios from 'axios';
// import { use } from '../../../../../server/routes/video';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "food"},
    {value: 1, label: "desert"},
    {value: 2, label: "all"}
]

function UploadPage() {

    const [PostTitle, setPostTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("food")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setPostTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files)
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)

                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.filePath)

                    //gerenate thumbnail with this filepath ! 

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                console.log(response.data)
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.thumbsFilePath)
                            } else {
                                alert('Failed to make the thumbnails');
                            }
                        })
                        
                } else {
                    alert('failed to save the video in server')
                }
            })

    }

    return (
        <div style = {{ maxWidth: '700px', margin: '2rem auto'}}>
            <div style = {{ textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload</Title>
            </div>

            <Form onSubmit>
                <div style = {{ display: 'flex', justifyContent: 'space-between'}}>
                    {/*  drop zone */}
                    <Dropzone
                    onDrop = {onDrop}
                    multiple = {false}
                    maxSize = {8000000000}
                    >
                    {({ getRootProps, getInputProps }) => (
                        <div style = {{ width: '300px', height: '240px', border: '1px solid lightgray',
                    alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type = "plus" style = {{ fontSize: '3rem'}} />
                    </div>
                    )}

                    </Dropzone>
                    {/* Thumnail */}
                    
                    {ThumbnailPath !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="haha" />
                        </div>
                    }

                </div>
                <br />
                <br />
                
                <label>Title</label>
                <Input 
                    onChange = {onTitleChange}
                    value = {PostTitle}
                />
                <br />
                <br />
                
                <label>Descrption</label>
                <TextArea
                    onChange = {onDescriptionChange}
                    value = {Description}
                />
                <br />
                <br />

                <select onChange = {onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                
                <select onChange = {onCategoryChange}>
                     {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                     ))}
                </select>
                <br />
                <br />

                <Button type = "Primary" size="large" onClick>
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default UploadPage
