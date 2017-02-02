import React from 'react';

const QuantityBadge = (props) => {
    return (
        <a className="btn btn-primary pi-badge" href="#">
            <span className=" badge">{props.quantity}</span>
            <span>{props.label}</span>
         </a>
    );
};

export default QuantityBadge;