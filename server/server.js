require("dotenv").config();
var express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  SpotifyStrategy = require("passport-spotify").Strategy,
  consolidate = require("consolidate");

let spotify = require("./spotify.js");

var port = 5000;
var authCallbackPath = "/auth/spotify/callback";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and spotify profile), and invoke a callback with a user object.

let token = "";

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:" + port + authCallbackPath,
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        console.log(profile);
        token = accessToken;
        return done(null, profile);
      });
    }
  )
);

var app = express();

// configure Express
app.set("views", __dirname + "/views");
app.set("view engine", "html");

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

app.engine("html", consolidate.nunjucks);

app.get("/", function (req, res) {
  res.render("index.html", { user: req.user });
});

app.get("/playlists", ensureAuthenticated, function (req, res) {
  spotify.getUserPlaylists(token).then(function (data) {
    res.json(data);
  });
});

app.get("/playlists/:id", ensureAuthenticated, async function (req, res) {
  let dataa = await spotify.getUserPlaylistsByID(req.params.id, token)
  console.log(dataa);
  res.json(dataa);
  // res.send("Hello World!");
});

app.get("/login", function (req, res) {
  res.render("login.html", { user: req.user });
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: [
      "playlist-modify-public",
      "playlist-read-private",
      "playlist-modify-private",
      "playlist-read-collaborative",
    ],
    showDialog: true,
  })
);

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  authCallbackPath,
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("redirecting to /");
    req.session.token = token;
    res.redirect("/");
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(port, function () {
  console.log("App is listening on port " + port);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/spotify");
}
