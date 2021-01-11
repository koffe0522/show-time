import React from 'react';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Main from '@/layouts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    div: {
      display: 'flex',
      flexDirection: 'column',
      width: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formControl: {
      margin: theme.spacing(3),
    },
    button: {
      margin: theme.spacing(1, 1, 0, 0),
    },
  }),
);

export default function ChannelCreate() {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Choose wisely');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('handleSubmit', value);
  };

  return (
    <Main>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card className={classes.div}>
          <TextField required id="standard-required" label="channel name" />
          <FormControl component="fieldset" error={error} className={classes.formControl}>
            <RadioGroup aria-label="type" name="type" value={value} onChange={handleRadioChange}>
              <FormControlLabel value="live" control={<Radio />} label="Live" />
              <FormControlLabel value="rtc" control={<Radio />} label="Group chat" />
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
            <Button type="submit" variant="outlined" color="primary" className={classes.button}>
              create channel
            </Button>
          </FormControl>
        </Card>
      </form>
    </Main>
  );
}
