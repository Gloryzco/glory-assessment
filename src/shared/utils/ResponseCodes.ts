export const ResponseCodes = {
  // Handler for all successful requests | Code: '200'
  '0000': {
    type: 'success',
    status: 'SUCCESS',
    code: '00',
    message: 'Successful',
  },

  // Handler for all failed requests or validation or Not Found requests | Code: '400',
  '0001': {
    type: 'error',
    status: 'FAILED',
    code: '01',
    message: 'Request failed',
  },

  // Handler for system failure | Code: '500',
  '0002': {
    type: 'error',
    status: 'ERROR',
    code: '02',
    message: 'System failure',
  },
};
