module.exports = function (app) {
    var models = require("./model/models.server")();
    require("./services/customer.service.server.js")(app, models.customerModel);
    //require("./services/product.service.server.js")(app, models.productModel);
    //require("./services/store.service.server.js")(app, models.storeModel);
    //require("./services/owner.service.server.js")(app, models.ownerModel);
};