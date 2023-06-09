import React from 'react';
import styles from './UserInfo.module.scss';
import moment from 'moment';
import Chip from '@mui/material/Chip';

export const UserInfo = ({ avatarUrl, fullName, createdAt, additionalText, completed }) => {
  return (
    <div className={styles.root}>
      <div>
        <Chip
          label={completed ? 'Completed' : 'In progress'}
          color={completed ? "success" : "primary"}
          size="small"
        />
      </div>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText ? additionalText : ''}</span>
        <span className={styles.additional}>{createdAt ? moment(createdAt).format('DD MMM YYYY, HH:mm') : ''}</span>
      </div>
    </div>
  );
};
