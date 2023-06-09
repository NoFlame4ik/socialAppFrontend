import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import moment from "moment";
import {Grid, Typography} from "@mui/material";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  return (
    <SideBlock title="Коментарі">
      <List>
        {(isLoading ? [...Array(5)] : items).map((item, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" secondaryAction={(
              <Typography variant="body2">
                {item.createdAt ? moment(item.createdAt).format('DD MMM YYYY, HH:mm') : ''}
              </Typography>
            )}>
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={item.user.fullName} src={item.user.avatarUrl}>
                    {item.user.avatarUrl || item.user.fullName?.[0]}
                  </Avatar>
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={item.user.fullName}
                  secondary={item.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
