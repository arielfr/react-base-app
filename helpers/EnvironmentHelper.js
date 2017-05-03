/**
 * Created by arey on 4/28/17.
 */
const nodeEnvironment = process.env.NODE_ENV;

module.exports = {
  getEnvironment: () => {
    return process.env.NODE_ENV || 'development';
  },
  isDevelopment: () => {
    return (nodeEnvironment === undefined || nodeEnvironment !== 'production');
  }
};