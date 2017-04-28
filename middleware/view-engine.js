const handlebars = require('express-handlebars');
const layouts = require('express-handlebars-layouts');
const config = require('config');
const swag = require('swag');
const moment = require('moment');

module.exports = function (app, baseDirectory) {
  const hbs = handlebars.create({
    partialsDir: [
      'templates/partials/'
    ]
  });

  //Register layouts helpers on handlebars
  hbs.handlebars.registerHelper(layouts(hbs.handlebars));
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
  hbs.handlebars.registerHelper('translate', function (method) {
    const keys = Object.keys(arguments);
    let args = [];

    //Start from 1 (Ignore method), without the last one (Ignore the arguments injected by Handlebars)
    for (let i = 1; i < (keys.length - 1); i++) {
      args.push(arguments[keys[i]]);
    }

    return translatorService.__proto__[method].apply(null, args);
  });
  hbs.handlebars.registerHelper('times', function (n, block) {
    let accum = '';

    for (let i = 1; i <= n; ++i) {
      accum += block.fn(i, {data: {index: i}});
    }

    return accum;
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
  hbs.handlebars.registerHelper('is_user', function (user, options) {
    if (user.role_id == 1) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_only_user', function (user, options) {
    if (user.role_id == 1 && !user.sitter_apply) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_in_progress', function (user, options) {
    if (user.role_id == 1 && user.sitter_apply) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_sitter_or_in_progress', function (user, options) {
    if ((user.role_id == 1 && user.sitter_apply) || (user.role_id == 2)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_sitter', function (user, options) {
    if (user.role_id == 2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_sitter_not_publicated', function (user, options) {
    if (user.role_id == 2 && !user.publication_ready) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_admin', function (user, options) {
    if (user.role_id == 3) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_pre_sitter', function (user, options) {
    if (user.role_id == 4) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('is_not_pre_sitter', function (user, options) {
    if (user.role_id != 4) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.handlebars.registerHelper('moment_format_date', function (date, options) {
    return moment(date).format('DD/MM/YYYY');
  });
  hbs.handlebars.registerHelper('moment_format_date_details', function (date, options) {
    return capitalizeFirst(moment(date).format('MMMM DD, YYYY'));
  });
  hbs.handlebars.registerHelper('generate_details_url', function (uuid, from, to, sizes, options) {
    return '/details?' + toUrlParams({
        uuid: uuid || '',
        size: sizes || '',
        from: from || '',
        to: to || ''
      });
  });

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', baseDirectory + '/templates');

  if (config.get('handlebars.cache')) {
    app.enable('view cache');
  }
};

function capitalizeFirst(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function toUrlParams(obj) {
  return Object.keys(obj).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  }).join('&');
}