import React, {useState} from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import styles from './AddTask.module.scss';
import {Slider, Box, Grid, Typography} from "@mui/material";
import {notifyError, notifyWarning} from "../../components/Notify";
import {getTaskById} from "../../redux/slices/tasks";

export const AddTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(30);
  const [experience, setExperience] = useState(30);

  const isEditing = Boolean(id);

  const onSubmit = async () => {
    if (!title || !description) return notifyWarning('Потрібно заповнити всі поля для публікації!');
    try {
      setLoading(true);

      const fields = {
        title,
        description,
        experience,
        points,
      };

      const { data } = isEditing
        ? await axios.patch(`/tasks/${id}`, fields)
        : await axios.post('/tasks', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/tasks/${_id}`);
    } catch (err) {
      notifyError('Помилка при створенні задачі!')
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      getTaskById(id)
        .then(({ data }) => {
          setTitle(data.title);
          setDescription(data.description);
          setExperience(data.experience);
          setPoints(data.points);
        })
        .catch(() => {
          notifyError('Помилка при отриманні задачі!');
        });
    }
  }, [id]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '320px',
      autofocus: true,
      placeholder: 'Ввведіть текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: Date.now(),
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        disabled={isLoading}
        required
      />
      <Box sx={{ width: 450 }}>
        <Typography id="input-slider" gutterBottom>
          Experience
        </Typography>
          <Grid item xs>
            <Slider
              aria-label="Experience"
              defaultValue={30}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={10}
              max={100}
              value={experience}
              onChange={((_, value) => setExperience(value))}
              disabled={isLoading}
            />
        </Grid>
      </Box>
      <Box sx={{ width: 450 }}>
        <Typography id="input-slider" gutterBottom>
          Points
        </Typography>
        <Grid item xs>
          <Slider
            aria-label="Points"
            defaultValue={30}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={10}
            max={100}
            value={points}
            onChange={((_, value) => setPoints(value))}
            disabled={isLoading}
          />
        </Grid>
      </Box>
      <SimpleMDE
        className={styles.editor}
        value={description}
        onChange={(value) => setDescription(value)}
        options={options}
        aria-required="true"
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Зберегти' : 'Опубліковати'}
        </Button>
        <a href="/">
          <Button size="large">Відміна</Button>
        </a>
      </div>
    </Paper>
  );
};
