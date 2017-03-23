module.exports = function(app) {
    var models = require("./model/models.server")();
    //var userModel = require("./model/user/user.model.server")(app);
    require("./services/user.service.server.js")(app, models.userModel);
    //var websiteModel = require("./model/website/website.model.server")(app);
    require("./services/website.service.server.js")(app, models.websiteModel);
    //var pageModel = require("./model/page/page.model.server")(app);
    require("./services/page.service.server.js")(app, models.pageModel);
    //var widgetModel = require("./model/widget/widget.model.server")(app);
    require("./services/widget.service.server.js")(app, models.widgetModel);
};
