module.exports = function (app, adminModel) {

    app.get("/api/admin", findAdminByCredentials);
    app.get("/api/customers", findAllCustomers);

    function findAdminByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        adminModel
            .findAdminByCredentials(username, password)
            .then(function (admin) {
                if(admin) {
                    res.json(admin);
                }
                else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error);
            })
    }

    function findAllCustomers(req, res) {
        adminModel
            .findAllCustomers()
            .then(function (customers) {
                if(customers) {
                    res.json(customers);
                }
                else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error);
            })
    }
};