import React from 'react';
import "./card.css"
function Card({ image, name }) {
    return (
        <div className="experiment-card ">
            <div className="experiment-card-content">
                <img src={image} alt={name} className="experiment-card-image" />
            </div>
            <div className="experiment-card-footer font-exo font-bold">
                {name}
            </div>
        </div>
    );
}

export default Card;