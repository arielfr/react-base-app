/**
 * Created by arey on 9/19/17.
 */
const device = require('device');
const config = require('config');

/**
 * The available types from the library are:
 * desktop, tv, tablet, phone, bot, card
 */
const desktopDevices = ['desktop', 'tv', 'bot'];

module.exports = (req, res, next) => {
  // Detect the device type depending on the user-agent
  const detection = device(req.header('user-agent'), {
    parseUserAgent: config.get('device-detection.get-model'),
  });

  req.device = {
    // If its not a desktop device, is mobile
    type: (desktopDevices.indexOf(detection.type) !== -1) ? 'desktop' : 'mobile',
    // This element is always empty unless parseUserAgent is true (performance)
    model: detection.model,
  };

  next();
};
