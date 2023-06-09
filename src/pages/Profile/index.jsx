import React, {useState, useEffect} from 'react';
import {Navigate, Link as ReactLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import 'easymde/dist/easymde.min.css';
import {fetchAuthMe, selectIsAuth} from '../../redux/slices/auth';
import axios from '../../axios';
// TODO add styles file
import styles from './Profile.module.scss';
import {Box, Grid, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Save';
import Link from"@mui/material/Link";
import {notifyError} from "../../components/Notify";

export const Profile = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);

  const [isLoading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!!userData) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);


  useEffect(() => {
    if (userData) {
      setFullName(userData?.fullName);
    }
  }, [userData]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const { data } = await axios.patch('/profile', { fullName });

      if (!!data) {
        dispatch(fetchAuthMe());
      }
    } catch (err) {
      notifyError('Помилка при оновленні профіля!');
    } finally {
      setLoading(false);
    }
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      Профіль користувача
      {isLoading && ('Loading...')}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {isEditing ? (
          <TextField
            variant="standard"
            placeholder="Повне ім'я"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            disabled={isLoading}
          />
        ) : (
          <div>
            {userData?.fullName}
          </div>
        )}
        <div>
          {isEditing ? (
            <IconButton
              color="primary"
              onClick={() => {
                onSubmit();
                setIsEditing(false);
              }}>
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          )}
        </div>
      </div>
      <Box sx={{ maxWidth: 350 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2">Отримані поінти: {userData?.points}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Отриманий досвід: {userData?.experience}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Completed tasks: */}
      {userData?.completedTasks?.length && (
        <Box sx={{ maxWidth: 700 }}>
          Виконані завдання:
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {userData?.completedTasks?.map((task) => (
              <Grid item xs={3}>
                <Link component={ReactLink} to={`/tasks/${task?.id}`} underline="none">
                  <Typography noWrap variant="body2">
                    {task?.title}
                  </Typography>
                </Link>
              </Grid>
            ))}
            <Grid item xs={3}>
              <Typography gutterBottom variant="body2">
                Total: {userData?.completedTasks?.length || 0}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      <div>
        {userData?.email}
      </div>
      {/*<div>*/}
      {/*  Отриманий досвід:*/}
      {/*  {userData?.experience}*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  Points:*/}
      {/*  {userData?.points}*/}
      {/*</div>*/}
    </Paper>
  );
};
