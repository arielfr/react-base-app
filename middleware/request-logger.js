/**
 * Created by arey on 2/9/17.
 */
module.exports = function(app){
  app.use(function(req, res, next){
    //Do not log static urls
    var regex = /^\/(css|js|fonts|images)\//,
      ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(!regex.test(req.url)){
      console.log(ip + ' - [' + req.method + '] ' + req.url);
    }

    next();
  });
};