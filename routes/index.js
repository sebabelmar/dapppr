var dribbbleAPI = require('../apiRequests/dribbbleService');

exports.signUpPage = function (req, res) {

    res.render('signup');

};

exports.postUserName = function (req, res) {

    var username = req.body.dribbbleUserName;
    console.log("from the dribbble service the username is " +username);

    var requestForUserInformation  = require('request');
    requestForUserInformation({
        uri: "http://api.dribbble.com/players/"+username+"/shots",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
    }, function(err, response, body){

        // console.log(body);

        var dribbbleUserResponse = JSON.parse(body);
        var dribbbleUserShots = dribbbleUserResponse.shots;
        var artistProducts = [];

        var artist = new Artist();
        artist.set('name', dribbbleUserShots[0].player.name);

        var PNGREGEX = /\.(png)\b/;

        for (var i = 0; i < 14; i++) {

            var currentImageUrl = dribbbleUserShots[i].image_url;

            if (PNGREGEX.exec(currentImageUrl)) {

                var product = new Product();
                product.set('originalArtwork', dribbbleUserShots[i].title);
                product.set('artworkUrl', dribbbleUserShots[i].image_url);
                product.set('likesCount', dribbbleUserShots[i].likes_count);
                product.set('shirtColor', '');
                product.set('height', '');
                product.set('width', '');
                product.set('price', '');
                product.set('artistOfProduct', artist);
                product.save();
                artistProducts.push(product);

            }

        }

            artist.set('userFollowers', dribbbleUserShots[0].player.followers_count);
            artist.set('userLikes', dribbbleUserShots[0].player.likes_received_count);
            artist.set('userPortfolioURL', dribbbleUserShots[0].player.url);
            artist.set('avatar_url', dribbbleUserShots[0].player.avatar_url);
            artist.set('artistID', artist.id);
            artist.save(null, {
                success: function(artist) {
                    var artistID = artist.id;
                    // console.log(artistID);
                    res.redirect('/' +artistID);
                }, error: function(artist, error) {
                    console.log(error.message);
                }
            });

        });

};

exports.showUserProductsPage = function (req, res) {

    // console.log(req.params);
    var artistID = req.params.userId;

    var query = new Parse.Query(Artist);
    query.get(artistID, {
        success: function(artist){
            console.log(artist);

            res.render('myproducts', {
                user: artist._serverData
            });

        }
    });

};

exports.editProduct = function (req, res) {

    var artistID = req.params.userId;
    var artworkID = req.params.artworkId;

    var query = new Parse.Query(Artist);
    query.get(artistID, {
        success: function(artist){
            res.render('editProduct', {
                user: artist._serverData
            });
        }
    });

};
