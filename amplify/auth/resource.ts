import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
      mutable: false,
    },
  },
  accountRecovery: 'EMAIL_ONLY',
  verification: {
    email: {
      deliveryMedium: 'EMAIL',
      emailSubject: 'Verify your Task Manager account',
      emailBody: 'Hello, Please click the link below to verify your account: {##Verify Email##}',
    },
  },
});
