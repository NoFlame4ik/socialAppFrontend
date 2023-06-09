import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import {Task} from '../components/Task';
import {UsersBlock} from '../components/UsersBlock';
import {fetchTasks, fetchTags} from '../redux/slices/tasks';
import {notifyError} from "../components/Notify";
import axios from "../axios";
import {useSearchParams} from "react-router-dom";
import {Box} from "@mui/material";
import PointReward from "./PointReward";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


export const getUsers = () => (
  axios.get('/usersByPoints')
);

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const {tasks, tags} = useSelector((state) => state.tasks);
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangeTab = (event, newTab) => {
    setSearchParams({ tab: newTab.toString() || ''});
  };


  const isTasksLoading = tasks.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchTasks()).then((res) => {
      if (res?.error?.message) {
        notifyError(res?.error?.message);
      }
    });
    dispatch(fetchTags());
  }, [dispatch]);

  const getUsersAndSetState = () => {
    setUsersLoading(true);
    getUsers()
      .then((res) => setUsersList(res?.data))
      .catch((err) => notifyError(err?.message || 'Something went wrong!'))
      .finally(() => setUsersLoading(false));
  }

  useEffect(() => {
    getUsersAndSetState();
  }, []);

  return (
    <>
      <Tabs
        value={searchParams.get('tab') ? Number(searchParams.get('tab')) : 0}
        onChange={handleChangeTab}
        aria-label="tabs"
        style={{ marginBottom: 15 }}
      >
        <Tab label="Доступні завдання"/>
        <Tab label="Сторінка обміну зароблених поінтів"/>
      </Tabs>
      <TabPanel index={0} value={searchParams.get('tab') ? Number(searchParams.get('tab')) : 0}>
        <Grid container spacing={4}>
          <Grid xs={8} item>
            {!tasks.items.length && ("Немає даних")}
            {(isTasksLoading ? [...Array(5)] : tasks.items).map((data, index) =>
              isTasksLoading ? (
                <Task key={index} isLoading={true}/>
              ) : (
                <Task
                  key={data._id}
                  id={data._id}
                  title={data.title}
                  points={data.points}
                  experience={data.experience}
                  completed={data.completed}
                  user={data.user}
                  createdAt={data.createdAt}
                  commentsCount={(data?.comments || []).length}
                  isEditable={(userData && data.user && userData?._id === data.user?._id) || userData?.role === 'admin'}
                  onReload={() => {
                    dispatch(fetchTasks());
                    getUsersAndSetState();
                  }}
                />
              ),
            )}
          </Grid>
          <Grid xs={4} item>
            <UsersBlock items={usersList} isLoading={usersLoading} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel index={1} value={searchParams.get('tab') ? Number(searchParams.get('tab')) : 0} key={1}>
        <PointReward userData={userData} />
      </TabPanel>
    </>
  );
};
