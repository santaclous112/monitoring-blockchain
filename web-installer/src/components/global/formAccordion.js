import React from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import { Accordion, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  icon: {
    paddingRight: '1rem',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function FormAccordion(icon, name, form, table) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <img
            src={icon}
            className={classes.icon}
            alt="TelegramIcon"
          />
          <Typography
            style={{ textAlign: 'center' }}
            variant="h5"
            align="center"
            gutterBottom
          >
            {name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {form}
            </Grid>
            <Grid item xs={12}>
              {table}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

FormAccordion.propTypes = forbidExtraProps({
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  form: PropTypes.element.isRequired,
  table: PropTypes.element.isRequired,
});

export default FormAccordion;
