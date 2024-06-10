const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const {Strategy: JwtStrategy, ExtractJwt} = require("passport-jwt");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    }
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const userModel = new mongoose.model("User", userSchema);


passport.use(userModel.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        done(err,user)
    })
});

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/profile"
    },
    function(accessToken, refreshToken, profile, done) {
        userModel.findOrCreate({ googleId: profile.id }, async function (err, user) {
            user.email = profile.emails[0].value;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            done(err, user);
            await user.save();
        });
    }
));

passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET
    }, async (payload, done) =>{
        try {
            const user = await userModel.findById(payload.userId).select('email id');
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        }
        catch (e){
            console.log(e);
        }
    })
)


module.exports =  userModel;