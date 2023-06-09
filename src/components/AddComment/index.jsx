import React, {useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {notifyError} from "../Notify";
import axios from "../../axios";
import {useSelector} from "react-redux";

export const AddComment = ({ id, onReload }) => {
  const userData = useSelector((state) => state.auth.data);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = () => {
    setLoading(true);
    axios.post(`/tasks/${id}/comment`, { text: text })
      .then((res) => {
      if (!res?.error?.message) {
        if (onReload) {
          setText('');
          onReload?.();
        }
      } else {
        notifyError(res?.error?.message);
      }
    }).finally(() => setLoading(false));
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{root: styles.avatar}}
          src={undefined}
          alt={userData?.fullName?.[0] || ''}
        >
          {userData?.fullName?.[0] || ''}
        </Avatar>
        <div className={styles.form}>
          <TextField
            label="Написати коментар"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment} disabled={loading || !text.length}>
            Відправити
          </Button>
        </div>
      </div>
    </>
  );
};
