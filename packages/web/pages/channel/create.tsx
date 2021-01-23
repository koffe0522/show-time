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

import { useChannel } from '@/hooks/channel';

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
    input: {
      display: 'none',
    },
  }),
);

export default function ChannelCreate() {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [file, setFile] = React.useState<File>(null);
  const [helperText, setHelperText] = React.useState('Choose wisely');
  const { create, loading, error } = useChannel();

  const createObjectURL =
    (window.URL || window.webkitURL).createObjectURL || (window as any).createObjectURL;

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files.item(0));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    create({ channelName: 'test', type: value, file: file, uid: 1234 });
    console.log('handleSubmit', value);
  };

  return (
    <Main>
      {error ? <p>error</p> : null}
      {loading ? <p>...loding</p> : null}
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card className={classes.div}>
          <TextField required id="standard-required" label="channel name" />
          {file ? <img src={createObjectURL(file)} /> : null}
          <input
            accept="image/*"
            id="raised-button-file"
            multiple
            type="file"
            onInput={handleInputFile}
          />
          <FormControl component="fieldset" className={classes.formControl}>
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
