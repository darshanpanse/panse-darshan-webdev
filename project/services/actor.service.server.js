module.exports = function (app, actorModel) {

    var passport = require('passport');
    //var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    //var FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeActor);
    passport.deserializeUser(deserializeActor);

    app.post('/api/actor/login', passport.authenticate('local'), login);
    app.post("/api/actor/logout", logout);
    app.post("/api/actor/register", register);
    //app.get("/api/actor", findactorByCredentials);
    app.get("/api/actor-username", findActorByUsername);
    app.get("/api/actor-email", findActorByEmail);
    app.get("/api/actor-phone", findActorByPhone);
    app.get("/api/actor", findActorsByIds);
    app.post("/api/actor", createActor);
    app.post("/api/actor/loggedIn", loggedIn);
    app.post("/api/actor/isAdmin", isAdmin);
    app.post("/api/actor/isRegisteredOwner", isRegisteredOwner);
    app.post("/api/addProductToActorFavourites", addProductToActorFavourites);
    app.put("/api/removeProductFromActorFavourites", removeProductFromActorFavourites);
    app.put("/api/removeStoreFromActorFavourites", removeStoreFromActorFavourites);
    app.post("/api/addProductToActorLikes", addProductToActorLikes);
    app.post("/api/addProductToActorComments", addProductToActorComments);
    app.get("/api/verifyActorByPassword", verifyActorByPassword);
    app.put("/api/changePassword", changePassword);
    //app.put("/api/actor/:actorId", updateactor);
    //app.delete("/api/actor/:actorId", deleteactor);
    app.post("/api/addStoreToActorFavourites", addStoreToActorFavourites);
    app.post("/api/addStoreToActorLikes", addStoreToActorLikes);
    app.post("/api/addStoreToActorComments", addStoreToActorComments);
    app.get("/api/admin/customers", findAllCustomers);
    app.get("/api/admin/owners", findAllStoreOwners);
    app.get("/api/admin/requests", findAllRegistrationRequests);
    app.get("/api/admin/findActorById", findActorById);
    app.put("/api/actor/updateProfile", updateProfile);
    app.delete("/api/actor/delete", deleteAccount);
    app.delete("/api/delete/request", removeRegistrationRequest);
    app.post("/api/actorsArray", findActorsByArraysOfIds);
    app.post("/api/addToFollowing", addToFollowing);
    app.post("/api/addToFollowers", addToFollowers);
    app.put("/api/removeFromFollowing", removeFromFollowing);
    app.put("/api/removeFromFollowers", removeFromFollowers);
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    var googleConfig = {
        clientID :     process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    app.get('/google/auth/callback',
        passport.authenticate('google', {
            successRedirect: '/project/index.html#/',
            failureRedirect: '/project/index.html#/actor/login'
        }));

    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/#/user',
    //         failureRedirect: '/#/login'
    //     }));

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function removeFromFollowing(req, res) {
        var currentActor = req.body.currentActor;
        var actorId = req.body.actorId;
        actorModel
            .removeFromFollowing(currentActor, actorId)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.send(error);
            })
    }

    function removeFromFollowers(req, res) {
        var currentActorId = req.body.currentActorId;
        var actor = req.body.actor;
        actorModel
            .removeFromFollowers(currentActorId, actor)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.send(error);
            })
    }

    function removeProductFromActorFavourites(req, res) {
        var actor = req.body.actor;
        var productId = req.body.productId;
        actorModel
            .removeProductFromActorFavourites(actor, productId)
            .then(function (response) {
                if(response) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function removeStoreFromActorFavourites(req, res) {
        var actor = req.body.actor;
        var storeId = req.body.storeId;
        actorModel
            .removeStoreFromActorFavourites(actor, storeId)
            .then(function (response) {
                if(response) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function addToFollowing(req, res) {
        var currentActorId = req.query.currentActorId;
        var actorId = req.query.actorId;
        actorModel
            .addToFollowing(currentActorId, actorId)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.send(error);
            })
    }

    function addToFollowers(req, res) {
        var currentActorId = req.query.currentActorId;
        var actorId = req.query.actorId;
        actorModel
            .addToFollowers(currentActorId, actorId)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.send(error);
            })
    }

    function findActorsByArraysOfIds(req, res) {
        // var actorIds = req.query.actorIds;
        // console.log(typeof actorIds);
        // console.log(actorIds);
        // actorIds = actorIds.split(",");

        var actorIds = req.body;
        actorModel
            .findActorsByArraysOfIds(actorIds)
            .then(function (response) {
                if(response) {
                    res.json(response);
                }
                else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log(error);
                res.send(error);
            })


    }

    function findActorsByIds(req, res) {
        var actorIds = req.query.actorIds;
        console.log(actorIds);
        var actors = actorIds.split(",");

        var listOfActors = [];
        actorModel
            .findActorsByIds(actors)
            .then(function (response) {
                if(response) {
                    res.json(response);
                }
                else {
                    res.sendStatus(404);
                }


            }, function (error) {
                console.log(error);
                res.send(error);
            });
    }

    function googleStrategy(token, refreshToken, profile, done) {
        actorModel
            .findActorByGoogleId(profile.id)
            .then(
                function(actor) {
                    if(actor) {
                        return done(null, actor);
                    }
                    else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return actorModel.createActor(newGoogleUser);
                    }
                },
                function(error) {
                    if (error) { return done(error); }
                }
            )
            .then(
                function(actor){
                    return done(null, actor);
                },
                function(error){
                    if (error) { return done(error); }
                }
            );
    }

    function removeRegistrationRequest(req, res) {
        var requestId = req.query.requestId;
        actorModel
            .removeRegistrationRequest(requestId)
            .then(function (response) {
                if(response) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function deleteAccount(req, res) {
        var actorId = req.query.actorId;
        // actorModel
        //     .findActorById(actorId)
        //     .then(function (actor) {
        //         if(actor.favourite_products.length > 0) {
        //
        //         }
        //     }, function (error) {
        //         console.log(error);
        //     });
        actorModel
            .deleteAccount(actorId)
            .then(function (actor) {
                if(actor) {
                    res.json(actor);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).res.send(error);
            });
    }

    function updateProfile(req, res) {
        var actor = req.body;
        actorModel
            .updateProfile(actor)
            .then(function (actor) {
                if(actor) {
                    res.json(actor);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).res.send(error);
            });
    }

    function findActorById(req, res) {
        var actorId = req.query.actorId;
        actorModel
            .findActorById(actorId)
            .then(function (actor) {
                if(actor) {
                    res.json(actor);
                } else {
                    res.send(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error)
            });
    }

    function findAllRegistrationRequests(req, res) {
        actorModel
            .findAllRegistrationRequests()
            .then(function (requests) {
                if(requests != null) {
                    res.json(requests);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function findAllStoreOwners(req, res) {
        actorModel
            .findAllStoreOwners()
            .then(function (owners) {
                if(owners != null) {
                    res.json(owners);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function findAllCustomers(req, res) {
        actorModel
            .findAllCustomers()
            .then(function (customers) {
                if(customers != null) {
                    res.json(customers);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function isAdmin(req, res) {
        res.send(req.isAuthenticated() && req.user.role == 'ADMIN' ? req.user : '0');
    }

    function addStoreToActorFavourites(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var storeId = info.storeId;
        return actorModel
            .addStoreToActorFavourites(actorId, storeId)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }

    function addStoreToActorLikes(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var storeId = info.storeId;
        return actorModel
            .addStoreToActorLikes(actorId, storeId)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }

    function addStoreToActorComments(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var storeId = info.storeId;
        var text = info.text;
        var timestamp = info.timestamp;
        return actorModel
            .addStoreToActorComments(actorId, storeId, text, timestamp)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }

    function verifyActorByPassword(req, res) {
        var actorId = req.query.actorId;
        var oldPassword = req.query.oldPassword;
        actorModel
            .verifyActorByPassword(actorId, oldPassword)
            .then(function (response) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function changePassword(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var newPassword = info.newPassword;
        actorModel
            .changePassword(actorId, newPassword)
            .then(function (response) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function serializeActor(actor, done) {
        done(null, actor);
    }

    function deserializeActor(actor, done) {
        actorModel
            .findActorById(actor._id)
            .then(
                function(actor){
                    done(null, actor);
                },
                function(error){
                    done(error, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        actorModel
            .findActorByCredentials(username, password)
            .then(function(user) {
                if (!user && user.accountStatus == 'DELETED') {
                    console.log("1");
                    return done(null, null);
                }
                return done(null, user);
                }, function(err) {
                    if (err) {
                        return done(err);
                    }
            });
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }
    
    function loggedIn(req, res) {
        res.send(req.isAuthenticated()? req.user : '0');
    }

    function isRegisteredOwner(req, res) {
        res.send(req.isAuthenticated() && req.user.role == 'STOREOWNER' ? req.user : '0');
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var actor = req.body;
        actor.password = bcrypt.hashSync(actor.password);
        actorModel
            .createActor(actor)
            .then(function (actor) {
                req.login(actor, function (error) {
                    if(error) {
                        res.send(error);
                    } else {
                        res.json(actor);
                    }
                })
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function addProductToActorFavourites(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var productId = info.productId;
        return actorModel
            .addProductToActorFavourites(actorId, productId)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error)
            })
    }

    function addProductToActorLikes(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var productId = info.productId;
        return actorModel
            .addProductToActorLikes(actorId, productId)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }

    function addProductToActorComments(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var productId = info.productId;
        var text = info.text;
        var timestamp = info.timestamp;
        return actorModel
            .addProductToActorComments(actorId, productId, text, timestamp)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error)
            })
    }

    function createActor(req, res) {
        var newActor = req.body;
        newActor.password = bcrypt.hashSync(newActor.password);

        actorModel
            .createActor(newActor)
            .then(function (actor) {
               if(actor) {
                   res.json(actor);
               } else {
                   res.sendStatus(404);
               }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findActorByUsername(req, res) {
        var username = req.query.username;
        actorModel
            .findActorByUsername(username)
            .then(function (actor) {
                if(actor) {
                    res.json(actor);
                } else {
                    res.sendStatus(400);
                }
            }, function (error) {
                res.sendStatus(404).send(error);
            });
    }

    function findActorByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        actorModel
            .authenticateActorByEmail(username, password)
            .then(function (actor) {
                if(actor.accountStatus == 'EXISTS') {
                    res.json(actor);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                    res.sendStatus(404).send(error);
            });
    }

    function findActorByEmail(req, res) {
        console.log("inside server service");
        var email = req.query.email;
        actorModel
            .findActorByEmail(email)
            .then(function (actor) {
                if(actor) {
                    res.json(actor);
                } else {
                    res.sendStatus(404);
                }
            },function (error) {
                res.sendStatus(404).send(error);
            });
    }
    
    function findActorByPhone(req, res) {
        console.log("inside server service");
        var phone = req.query.phone;
        actorModel
            .findActorByPhone(phone)
            .then(function (actor) {
                if(actor) {
                    res.json(actor);
                } else {
                    res.sendStatus(404);
                }
            },function (error) {
                res.sendStatus(404).send(error);
            });
    }
};