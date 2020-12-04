import * as Yup from 'yup';

const OpsGenieSchema = (props) => Yup.object().shape({
  config_name: Yup.string()
    .test(
      'unique-config-name',
      'OpsGenie config name is not unique.',
      (value) => {
        const { opsGenies } = props;
        if (opsGenies.allIds.length === 0) {
          return true;
        }
        for (let i = 0; i < opsGenies.allIds.length; i += 1) {
          if (opsGenies.byId[opsGenies.allIds[i]].config_name === value) {
            return false;
          }
        }
        return true;
      },
    )
    .required('Config name is required.'),
  api_token: Yup.string()
    .required('API token is required.'),
});

export default OpsGenieSchema;
