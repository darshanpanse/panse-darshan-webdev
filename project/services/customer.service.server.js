module.exports = function (app, customerModel) {

    app.get("/api/customer", findCustomerByCredentials);
    app.get("/api/customer-email", findCustomerByEmail);
    app.get("/api/customer-phone", findCustomerByPhone);
    app.post("/api/customer", createCustomer);
    //app.get("/api/customer/:customerId", findCustomerById);
    //app.put("/api/customer/:customerId", updateCustomer);
    //app.delete("/api/customer/:customerId", deleteCustomer);

    function createCustomer(req, res) {
        var newCustomer = req.body;
        console.log(newCustomer);
        customerModel
            .createCustomer(newCustomer)
            .then(function (customer) {
               if(customer) {
                   res.json(customer);
               } else {
                   res.sendStatus(404);
               }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findCustomerByCredentials(req, res) {
        console.log("inside server service");
        var identification = req.query.identification;
        var password = req.query.password;
        customerModel
            .authenticateCustomerByEmail(identification, password)
            .then(function (customer) {
                if(customer) {
                    res.json(customer);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                customerModel
                    .authenticateCustomerByPhone(identification, password)
                    .then(function (customer) {
                        if(customer) {
                            res.json(customer);
                        } else {
                            res.sendStatus(404);
                        }
                    }, function (error) {
                        res.sendStatus(404).send(error);
                    });
            });
    }

    function findCustomerByEmail(req, res) {
        console.log("inside server service");
        var email = req.query.email;
        customerModel
            .findCustomerByEmail(email)
            .then(function (customer) {
                if(customer) {
                    res.json(customer);
                } else {
                    res.sendStatus(404);
                }
            },function (error) {
                res.sendStatus(404).send(error);
            });
    }
    
    function findCustomerByPhone(req, res) {
        console.log("inside server service");
        var phone = req.query.phone;
        customerModel
            .findCustomerByPhone(phone)
            .then(function (customer) {
                if(customer) {
                    res.json(customer);
                } else {
                    res.sendStatus(404);
                }
            },function (error) {
                res.sendStatus(404).send(error);
            });
    }
};