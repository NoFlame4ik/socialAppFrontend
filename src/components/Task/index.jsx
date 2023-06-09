import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

import styles from './Task.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import {fetchCompleteTask, fetchRemoveTask} from '../../redux/slices/tasks';
import Button from "@mui/material/Button";
import {notifyError} from "../Notify";

export const Task = ({
  id,
  title,
  description,
  points,
  experience,
  completed,
  createdAt,
  user,
  commentsCount,
  children,
  isFullPost,
  isLoading,
  isEditable,
  onReload,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dialogProps, setDialogProps] = useState({
    open: false,
    title: 'Title',
    description: 'Description',
    type: 'complete', // 'complete' or 'delete' possible
  });

  if (isLoading) {
    return <PostSkeleton />;
  }

  /** Dialog handlers */
  const handleOpenDialog = ({title, description, type}) => setDialogProps({ open: true, title, description, type });

  const handleClose = () => {
    setDialogProps({ ...dialogProps, open: false });
  }

  const handleOkComplete = () => {
    dispatch(fetchCompleteTask(id)).then((res) => {
      if (!res?.error?.message) {
        if (onReload) {
          onReload?.();
        }
      } else {
        notifyError(res.error?.message);
      }
    });
  };

  const handleOkDelete = () => {
    dispatch(fetchRemoveTask(id)).then((res) => {
      if (res?.error?.message) {
        notifyError('Не вдалось видалити задачу!');
      } else {
        navigate('/');
      }
    });
  };

  const handleOk = () => {
    if (dialogProps.type === 'complete') {
      handleOkComplete();
    }
    if (dialogProps.type === 'delete') {
      handleOkDelete();
    }

    handleClose();
  }


  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {/** Confirm dialog \/ */}
      <Dialog
        open={!!dialogProps.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogProps?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogProps?.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Відміна</Button>
          <Button onClick={handleOk} autoFocus variant="contained" color={dialogProps.type === 'complete' ? 'success' : 'error'}>
            Підтвердити
          </Button>
        </DialogActions>
      </Dialog>
      {/** Confirm dialog /\ */}

      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/tasks/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleOpenDialog(
            {
              title: 'Видалити',
              description: 'Ви дійсно хочете видалити статтю?',
              type: 'delete',
            }
          )} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} createdAt={createdAt} completed={completed} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/tasks/${id}`}>{title}</Link>}
          </h2>
          <Box sx={{ maxWidth: 350 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2">Points: {points}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Experience: {experience}</Typography>
              </Grid>
            </Grid>
          </Box>

          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li style={{ opacity: 1 }}>
              {isEditable && completed === false && (
                <Button
                  onClick={() => handleOpenDialog(
                    {
                      title: 'Виконати',
                      description: 'Ви дійсно хочете позначити задачу як виконану?',
                      type: 'complete',
                    }
                  )}
                  variant="outlined"
                  size="small"
                  style={{ opacity: 1 }}
                >
                  Позначити як виконане
                </Button>
              )}
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
