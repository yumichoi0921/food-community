import React, { useState } from 'react'
import Axios from 'axios';
import Dropzone from 'react-dropzone'
import { Icon } from 'antd';


function FileUpload(props) {

    const [Images, setImages] = useState([])
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        console.log(files)

        Axios.post('/api/post/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setImages([...Images, response.data.filePath])
                    props.ImageRefreshFunction([...Images, response.data.filePath])
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }


    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.ImageRefreshFunction(newImages)
    }


    const onVideoDropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files)
        formData.append("file", files[0])

        Axios.post('/api/post/video', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)

                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.filePath)
                    props.FilePathRefreshFunction(response.data.filePath)

                    //gerenate thumbnail with this filepath ! 

                    Axios.post('/api/post/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                console.log(response.data)
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.thumbsFilePath)
                                props.ThumbnailRefreshFunction(response.data.fileDuration, response.data.thumbsFilePath)
                            } else {
                                alert('Failed to make the thumbnails');
                            }
                        })

                } else {
                    alert('Failed to save the video in server')
                }
            })
    }

    return (
        <div className="upload container">
            <label>대표 이미지</label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* 대표이미지 */}
                <Dropzone onDrop={dropHandler}>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            style={{
                                width: '300px', height: '240px', border: '1px solid lightgray',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}
                </Dropzone>

                {/* Thumnail */}
                <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                    {Images.map((image, index) => (
                        <div onClick={() => deleteHandler(image)} key={index}>
                            <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                                src={`http://localhost:5000/${image}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <br />

            <label >동영상</label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* 동영상 */}
                <Dropzone
                    onDrop={onVideoDropHandler}
                    multiple={false}
                    maxSize={8000000000}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{
                            width: '300px', height: '240px', border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
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
        </div>
    )
}

export default FileUpload
