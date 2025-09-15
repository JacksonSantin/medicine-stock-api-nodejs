const jwt = require("jsonwebtoken");

exports.googleLogin = (req, res, next) => {
  require("passport").authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

exports.googleCallback = (req, res, next) => {
  require("passport").authenticate(
    "google",
    { session: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "Falha no login com Google" });
      }
      // Gera token da sua API
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token, user });
    }
  )(req, res, next);
};
