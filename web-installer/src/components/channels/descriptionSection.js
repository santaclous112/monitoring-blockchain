import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcCallIcon from '@material-ui/icons/AddIcCall';
// core components
import GridContainer from 'components/material_ui/Grid/GridContainer.js';
import GridItem from 'components/material_ui/Grid/GridItem.js';
import InfoArea from 'components/material_ui/InfoArea/InfoArea.js';
import Data from 'data/channels';
import AlertSection from 'components/channels/alertSection.js';
import styles from 'assets/jss/material-kit-react/views/landingPageSections/productStyle.js';

const useStyles = makeStyles(styles);

export default function DescriptionSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h1 className={classes.title}>{Data.channels.subtitle_1}</h1>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title={Data.channels.what_title}
              description={(
                <div>
                  <ul>
                    <li>{Data.channels.what_1}</li>
                    <li>{Data.channels.what_2}</li>
                    <li>{Data.channels.what_3}</li>
                  </ul>
                </div>
              )}
              icon={HelpIcon}
              iconColor="#00000"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title={Data.channels.supported_title}
              description={(
                <div>
                  <ul>
                    <li>{Data.channels.channel_1}</li>
                    <li>{Data.channels.channel_2}</li>
                    <li>{Data.channels.channel_3}</li>
                    <li>{Data.channels.channel_4}</li>
                    <li>{Data.channels.channel_5}</li>
                  </ul>
                </div>
              )}
              icon={AddIcCallIcon}
              iconColor="#00000"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title={Data.channels.how_title}
              description={(
                <div>
                  <ul>
                    <li>{Data.channels.how_1}</li>
                    <li>{Data.channels.how_2}</li>
                    <li>{Data.channels.how_3}</li>
                    <li>{Data.channels.how_4}</li>
                  </ul>
                </div>
              )}
              icon={SettingsIcon}
              iconColor="#00000"
              vertical
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <h1 className={classes.title}>{Data.alerts.title}</h1>
            <br />
          </GridItem>
        </GridContainer>
        <AlertSection />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <h1 className={classes.title}>{Data.channels.subtitle_2}</h1>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
