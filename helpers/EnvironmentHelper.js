/**
 * Created by arey on 4/28/17.
 */
const nodeEnvironment = process.env.NODE_ENV;

module.exports = {
  isDevelopment: () => {
    return (nodeEnvironment === undefined || nodeEnvironment !== 'production');
  }
};