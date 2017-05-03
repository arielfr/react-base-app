const handlebars = require('express-handlebars');
const config = require('config');
const swag = require('swag');
const moment = require('moment');

module.exports = function (app, baseDirectory) {
  const hbs = handlebars.create({
    partialsDir: [
      'templates/partials/'
    ]
  });

  //Register swag extend helper
  hbs.handlebars.registerHelper(swag.helpers);
  //Override i18n - Adding helper for i18n
  /*
  hbs.handlebars.registerHelper('i18n', function (phrase) {
    return localization.i18n.__(phrase);
  });
   */
  hbs.handlebars.registerHelper('snippet', function (snippet) {
    return eval(snippet);
  });
  hbs.handlebars.registerHelper('stringify', function (json) {
    return JSON.stringify(json);
  });
  hbs.handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
    let operators;
    let result;

    if (arguments.length < 3) {
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
      options = rvalue;
      rvalue = operator;
      operator = "===";
    }

    operators = {
      '==': function (l, r) {
        return l == r;
      },
      '===': function (l, r) {
        return l === r;
      },
      '!=': function (l, r) {
        return l != r;
      },
      '!==': function (l, r) {
        return l !== r;
      },
      '<': function (l, r) {
        return l < r;
      },
      '>': function (l, r) {
        return l > r;
      },
      '<=': function (l, r) {
        return l <= r;
      },
      '>=': function (l, r) {
        return l >= r;
      },
      'typeof': function (l, r) {
        return typeof l == r;
      }
    };

    if (!operators[operator]) {
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('startsWith', function (lvalue, rvalue, options) {
    if (lvalue.startsWith(rvalue)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('negate', function (value, options) {
    if (!value) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', baseDirectory + '/templates');

  if (config.get('handlebars.cache')) {
    app.enable('view cache');
  }
};