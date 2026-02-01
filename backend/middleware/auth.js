import jwt from "jsonwebtoken";

/* ================= AUTH CHECK ================= */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

/* ================= ADMIN CHECK ================= */
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "ultra-admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};

/* ================= ROLE CHECK ================= */
export const checkRole = (req, res) => {
  res.json({
    isAdmin:
      req.user.role === "admin" || req.user.role === "ultra-admin",
  });
};
