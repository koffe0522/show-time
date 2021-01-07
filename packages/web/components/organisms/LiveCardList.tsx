import React from 'react';
import Link from 'next/link';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import TabNav from '@/components/molecules/TabNav';
import LiveCard from '@/components/molecules/LiveCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
    },
    root: {
      marginTop: theme.spacing(4),
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: '100%',
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  }),
);

export default function LiveCardList(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h3" component="h3">
        #オンライブ
      </Typography>
      <TabNav />
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Link href="/live/[id]" as="/live/523453">
              <a>live-stream</a>
            </Link>
          </Grid>
          <Grid item xs={2}>
            <Link href="/live/streamer" as="/live/streamer">
              <a>live-streamer</a>
            </Link>
          </Grid>
          <Grid item xs={2}>
            <Link href="/chat/[id]" as="/chat/523453">
              <a>chat</a>
            </Link>
          </Grid>

          <Grid item xs={2}>
            <LiveCard />
          </Grid>
          <Grid item xs={2}>
            <LiveCard />
          </Grid>
          <Grid item xs={2}>
            <LiveCard />
          </Grid>
          <Grid item xs={2}>
            <LiveCard />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
