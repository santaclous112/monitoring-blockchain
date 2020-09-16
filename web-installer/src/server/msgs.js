function ConfigSubmitted(config, path) {
  this.message = `${config} submitted in ${path}.`;
}

function TwilioCallSubmitted(phoneNumber) {
  this.message = `Twilio call to ${phoneNumber} submitted.`;
}

function EmailSubmitted(email) {
  this.message = `Email to ${email} submitted.`;
}

function TestAlertSubmitted() {
  this.message = 'Test alert submitted';
}

function TestEmail() {
  this.subject = 'Test Email from PANIC';
  this.text = 'Test Email from PANIC';
}

function TestAlert() {
  this.message = 'Test alert from PANIC';
}

function AuthenticationSuccessful() {
  this.message = 'Authentication Successful';
}

function AccountSavedSuccessfully() {
  this.message = 'Account saved successfully.';
}

module.exports = {
  ConfigSubmitted,
  TwilioCallSubmitted,
  EmailSubmitted,
  TestEmail,
  TestAlert,
  TestAlertSubmitted,
  AuthenticationSuccessful,
  AccountSavedSuccessfully,
};
