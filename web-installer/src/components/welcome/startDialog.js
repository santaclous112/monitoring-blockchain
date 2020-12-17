import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CHANNELS_PAGE } from 'constants/constants';
import { LoginButton } from 'utils/buttons';
import LoadConfig from 'containers/global/loadConfig';
import {StartNewButton } from 'utils/buttons';
import Data from 'data/welcome';

const StartDialog = ({values, errors, pageChanger, authenticate,
    checkForConfigs }) => {
  const [open, setOpen] = React.useState(false);

  // If authentication is accepted by the backend, change the page
  // to the channels setup and set authenticated.
  const setAuthentication = (authenticated) => {
    if (authenticated) {
      authenticate(authenticated);
      // Since it's authenticated we should check for configs
      const configResult = checkForConfigs();
      if (configResult) {
        setOpen(true);
      }else {
        pageChanger({ page: CHANNELS_PAGE });
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
    pageChanger({ page: CHANNELS_PAGE });
  };

  return (
    <div>
      <LoginButton
        username={values.username}
        password={values.password}
        disabled={(Object.keys(errors).length !== 0)}
        setAuthentication={setAuthentication}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {Data.dialog_title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Data.dialog_description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <StartNewButton onClick={handleClose} />
          <LoadConfig handleClose={handleClose} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StartDialog;