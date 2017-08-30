/**
 * Created by arey on 4/28/17.
 */
const { NODE_ENV } = process.env;

module.exports = {
  getEnvironment: () => {
    return NODE_ENV || 'development';
  },
  isDevelopment: () => {
    return (NODE_ENV === undefined || NODE_ENV !== 'production');
  }
};