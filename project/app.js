module.exports = function (app) {
    var models = require("./model/models.server")();
    require("./services/actor.service.server.js")(app, models.actorModel);
    require("./services/search.service.server.js")(app);
    require("./services/lyft.service.server.js")(app);
    require("./services/admin.service.server.js")(app, models.adminModel);
    require("./services/product.service.server.js")(app, models.productModel);
    require("./services/store.service.server.js")(app, models.storeModel);
    //require("./services/owner.service.server.js")(app, models.ownerModel);
};