// src/libs/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { createAccessToken } from "./jwt.js";

export function configurePassport(googleClientID, googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: "http://localhost:4000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // Si el usuario no existe, lo creamos
            user = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              password: "", // No necesitamos contraseña para autenticación con Google
              role: "student", // Rol por defecto
            });

            await user.save();
          }

          const token = await createAccessToken({
            id: user._id,
            role: user.role,
          });

          user.token = token;
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  return passport;
}
