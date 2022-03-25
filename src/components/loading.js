import ReactLoading from 'react-loading';
import { useEffect, useState } from 'react';
import './loading.css';
import { waitForPendingWrites } from 'firebase/firestore';

const Loading = () => {

    const loadingMsgs = [
        'Hold on',
        'We\'re getting it',
        'Keeping waiting',
        'It\'s taking longer than expected',
        'Check your connection'
    ];

    const [elLoaded, setElLoaded] = useState(false);
    const [msg, setMsg] = useState(loadingMsgs[0]);
    const [msgShown, setMsgShown] = useState(true);



    useEffect(() => {
        let i = 0;
        const int = setInterval(() => {
            if (i + 1 >= loadingMsgs.length) {
                clearInterval(int);
                return;
            }

            setMsgShown(false);

            window.setTimeout(() => {
                setMsg(loadingMsgs[i]);
                setMsgShown(true);
            }, 750);
            i++
        }, 2500);

        window.requestAnimationFrame(() => {
            setElLoaded(true);
        });

        return () => {clearInterval(int);}
    }, []);

    return (
        <section className={(elLoaded) ? 'loading-wrapper loaded' : 'loading-wrapper'}>
            <ReactLoading type="bubbles" color="#3500d3" width="90%" height="25%" className="ani-wrapper" />
            <div className={(msgShown) ? 'text active' : 'text'}>{msg}</div>
        </section>
    );
}

export default Loading;