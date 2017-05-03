const _ = require('lodash');
const moment = require('moment');
const config = require('config');

module.exports = function (app) {
  const defaultModel = {
    favicon: 'favicon.ico'
  };

  //This will append defualt configuration to all models
  function loadDefaultModel(req, res, model) {
    //Override the default keys with the ones on the model
    //_.merge({}, { a: 'a'  }, { a: undefined }) // => { a: "a" }
    //_.merge({}, { a: 'a'  }, { a: bb }) // => { a: "bb" }
    model = _.merge({}, defaultModel, model);

    //Save user on model
    //model.user = req.user;

    // Enable or disable Twak
    //model.twak = config.get('twak.enabled');

    //Setting moment locale
    moment.locale('es');

    return model;
  }

  app.use(function (req, res, next) {
    res.getHTML = function (view, model) {
      try {
        model = loadDefaultModel(req, res, model);
      } catch (error) {
        Promise.reject(error);
      }

      return res.renderAsyc(view, model);
    };

    res.renderSync = function (view, model) {
      //If something fail getting the configurations, show a 500 with no specific program styles
      try {
        model = loadDefaultModel(req, res, model);
      } catch (error) {
        //log.error(error);
        view = '500';
        model = {};
      }

      res.renderAsyc(view, model).then(function (pageRender) {
        res.send(pageRender);
      }).catch(error => {
        next(error);
      });
    };

    next();
  });
};