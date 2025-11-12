const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const { User, Role } = require('../db/models');

/* Not necessary with JWT
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
*/

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 
      where: { email: profile.emails[0].value },
      include: Role
    });

    if (!user) {
      const studentRole = await Role.findOne({ where: { name: 'student' } });

      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        roleId: studentRole.id
      });
    }

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'student'
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    done(null, { profile: tokenPayload, token });

  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;
