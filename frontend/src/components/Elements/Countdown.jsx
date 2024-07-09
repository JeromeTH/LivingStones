import React, {useState, useEffect} from 'react';
import './Countdown.css';

const Countdown = ({onComplete}) => {
    const [count, setCount] = useState(2);

    useEffect(() => {
        if (count >= 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [count, onComplete]);
    console.log(count);
    return (
        <div key={count} className={`countdown ${count < 0 ? 'hidden' : ''}`}>
            {count === 2 ? '剪刀' : count === 1 ? '石頭' : count === 0 ? '布' : count}
        </div>
    );
};

export default Countdown;
