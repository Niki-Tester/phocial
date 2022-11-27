import React from 'react';
import styles from '../styles/Avatar.module.css';

const Avatar = ({ src, height = 45, text }) => {
    return (
        <span>
            <img src={src} height={height} width={height} alt="avatar" className={styles.Avatar} />
            {text}
        </span>
    );
};

export default Avatar;