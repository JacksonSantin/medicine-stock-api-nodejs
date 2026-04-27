const admin = require("../../firebase");

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1]; // "Bearer <token>"
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = { uid: decoded.uid }; // salva UID do usuário na requisição
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authenticate;
