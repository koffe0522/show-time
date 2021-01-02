import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: "100%"
  },
  content: {
    minWidth: 180,
    minHeight: 180,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

type Props = {
  onClick: Function
}

export default function LiveCard(props: Props) {
  const { onClick } = props;

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.content}
        image="/user1.jpeg"
        title="Contemplative Reptile"
      >
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2" className={classes.title}>
            Word of the Day
        </Typography>
        </CardContent>
      </CardMedia>
    </Card>
  );
}

LiveCard.defaultProps = {
  onClick: () => { }
} as Props