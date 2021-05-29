import Axios from 'axios'
// import { response } from 'express'
import React, {useEffect, useState} from 'react'

function Subscribe(props) {

    const userTo = props.userTo
    const userFrom = props.userFrom

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        
        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }

        // 구독자 수 정보를 받아옴
        Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)

                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

            
        // 구독 여부를 받아옴
        Axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })

        
    }, [])

    const onSubscribe = () => {
        
        let subscribeVariables  = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        // 이미 구독중일 이라면
        if(Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소하는데 실패했습니다.')
                    }
                })

        // 아직 구독중이 아니라면     
        } else {
            Axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독하는데 실패했습니다.')
                    }
                })

        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px', 
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed': 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
