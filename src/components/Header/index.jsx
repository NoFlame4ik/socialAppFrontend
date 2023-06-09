import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import Avatar from "@mui/material/Avatar";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const userInitials = userData?.fullName.split(' ').map((item) => (item[0])).join('');

  /** Dialog handlers */
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  }

  const handleOk = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');

    handleClose();
  }

  return (
    <div className={styles.root}>
      {/** Confirm dialog \/ */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Вихід
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви дійсно хочете вийти з аккаунту?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Відміна</Button>
          <Button onClick={handleOk} autoFocus variant="contained" color="error">
            Підтвердити
          </Button>
        </DialogActions>
      </Dialog>
      {/** Confirm dialog /\ */}

      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>SocialEnvApp</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-task">
                  <Button variant="contained">Створити задачу</Button>
                </Link>
                <Button onClick={handleOpenDialog} variant="contained" color="error">
                  Вийти
                </Button>
                <Link to="/profile">
                  <Avatar alt="avatar" sx={{ width: 36, height: 36 }} variant="rounded">
                    {userInitials}
                  </Avatar>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Увійти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Створити аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
