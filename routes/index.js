queue = require('queue-async');

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
                product.save();
                artistProducts.push(product);

            }

        }

            artist.set('userFollowers', dribbbleUserShots[0].player.followers_count);
            artist.set('userLikes', dribbbleUserShots[0].player.likes_received_count);
            artist.set('userPortfolioURL', dribbbleUserShots[0].player.url);
            artist.set('avatar_url', dribbbleUserShots[0].player.avatar_url);
            artist.set('artistID', artist.id);
            artist.set('products', artistProducts);
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

    var artistID = req.params.userId;
    var query = new Parse.Query(Artist);
    query.include('products');
    query.get(artistID, {
        success: function(artist){
            console.log("THIS IS ARTIST " +artist._serverData);
            console.log("THIS IS PRODUCTS " +products);
            // var products = artist.get('products');

            var productURLS = [];
            var products = artist._hashedJSON.products;

            console.log(products.length);

            for (var i = 0; i < products.length; i++) {
                var productArtURL = products[i].artworkUrl;
                // productURLS.push(productArtURL);
                // console.log(productArtURL);
            }

            console.log("the products are " +products);
            for (var product in products) {
                var artworkURL = product.artworkUrl;
                console.log(artworkURL);
                productURLS.push(artworkURL);
            }

            console.log("the product urls are " +productURLS);


            res.render('myproducts', {
                user: artist._serverData,
                products: productURLS

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
