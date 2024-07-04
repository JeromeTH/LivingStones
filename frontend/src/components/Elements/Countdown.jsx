import React, { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);

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
      {count === 0 ? '猜拳' : count}
    </div>
  );
};

export default Countdown;
