import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { SideBlock } from './SideBlock';
import {Grid} from "@mui/material";

export const UsersBlock = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Лідери за очками">
      <List>
        {(isLoading ? [...Array(5)] : items).map((item, i) => (
          <ListItem key={i} disablePadding sx={{ padding: '4px 12px' }}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={9}>
                {isLoading ? <Skeleton width={100} /> : <ListItemText primary={item?.fullName || ''} />}
              </Grid>
              <Grid item xs={3} style={{ textAlign: 'right' }}>
                <ListItemText primary={item?.points || ''} />
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
