import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Button({ icon, children, ...props }) {
    return (
        <button className="button" {...props}>
            {icon && <FontAwesomeIcon icon={icon} className="icon" />}
            {children}
        </button>
    );
}

Button.propTypes = {
    icon: PropTypes.object,
    children: PropTypes.node.isRequired,
};

export default Button;
