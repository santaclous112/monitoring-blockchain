import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Typography, Grid, Switch, FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
}));

const PeriodicForm = (props) => {
  const classes = useStyles();

  const {
    periodic,
    savePeriodicDetails,
  } = props;

  return (
    <div>
      <form className={classes.root}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={2}>
            <Typography> Interval Seconds: </Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={periodic.time}
              type="text"
              name="time"
              placeholder="0"
              onChange={(event) => {
                savePeriodicDetails({
                  time: event.target.value,
                  enabled: periodic.enabled,
                });
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Typography> Enabled: </Typography>
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              control={(
                <Switch
                  checked={periodic.enabled}
                  onClick={() => {
                    savePeriodicDetails({
                      time: periodic.time,
                      enabled: !periodic.enabled,
                    });
                  }}
                  name="enabled"
                  color="primary"
                />
              )}
            />
          </Grid>
          <Grid item xs={9} />
        </Grid>
      </form>
    </div>
  );
};

PeriodicForm.propTypes = {
  savePeriodicDetails: PropTypes.func.isRequired,
  periodic: PropTypes.shape({
    time: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
};

export default PeriodicForm;
