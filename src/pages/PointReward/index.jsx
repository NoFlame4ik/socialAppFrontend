import {Box, Divider, Grid, Typography} from "@mui/material";
import React from "react";

const PointReward = ({ userData }) => {
  return (
    <div>
      <Box sx={{ maxWidth: 550 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2">У вас є <strong>{userData?.points || 0}</strong> поінтів</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Та ви отримали <strong>{userData?.experience || 0}</strong> досвіду за весь час.</Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ margin: '12px 0' }} />
      <Typography variant="h5">
        В майбутньому у вас буде можливість обміняти зароблені поінти на якусь послугу або для отримання певних привілегій.
      </Typography>
    </div>
  )
};

export default PointReward;
