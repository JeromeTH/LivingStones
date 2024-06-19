import React, {useState} from 'react';
import './Panel.css';

const Panel = ({items, title, renderEntry}) => {
    return (
        <div className="panel">
            <div className={"list-container"}>
                <h1>{title}</h1>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {renderEntry(item)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Panel;
