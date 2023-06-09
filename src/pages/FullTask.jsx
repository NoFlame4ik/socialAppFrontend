import React from 'react';
import {useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import {Task} from '../components/Task';
import {AddComment} from '../components/AddComment';
import {CommentsBlock} from '../components/CommentsBlock';
import {useDispatch, useSelector} from "react-redux";
import {getTaskById} from "../redux/slices/tasks";
import {Box, Typography} from "@mui/material";
import {notifyError} from "../components/Notify";

export const FullTask = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const {id} = useParams();
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (id) {
      getTaskById(id)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => {
          notifyError('Помилка при отриманні задачі');
        });
    }
  }, [id, dispatch]);


  if (isLoading) {
    return <Task isLoading={isLoading} isFullPost/>;
  }

  const handleOnReload = () => {
    getTaskById(id).then((res) => setData(res.data))
  }

  return (
    <>
      <Task
        id={data._id}
        title={data.title}
        points={data.points}
        experience={data.experience}
        completed={data.completed}
        user={data.user}
        createdAt={data.createdAt}
        commentsCount={(data?.comments || []).length}
        isFullPost
        isEditable={(userData && data.user && userData?._id === data.user?._id) || userData?.role === 'admin'}
        onReload={handleOnReload}
      >
        <Box className="scrollableDiv">
          <Typography variant="subtitle1">Опис:</Typography>
          <ReactMarkdown children={data?.description} />
        </Box>
      </Task>
      <CommentsBlock
        items={data?.comments?.map((item) => ({
          user: {
            fullName: item?.createdBy?.fullName,
            avatarUrl: undefined,
          },
          text: item.text,
          createdAt: item.createdAt,
        }))}
        isLoading={false}>

        <AddComment id={id} onReload={handleOnReload}/>
      </CommentsBlock>
    </>
  );
};
