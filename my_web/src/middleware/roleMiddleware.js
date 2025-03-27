// src/middleware/roleMiddleware.js
const { verifyToken } = require('../config/jwt');

const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            const decoded = verifyToken(token);
            req.user = decoded;

            // Kiểm tra vai trò
            if (!requiredRoles.includes(req.user.role) && !(req.user.isSuperAdmin && requiredRoles.includes('admin'))) {
                return res.status(403).json({ error: 'Access denied. Insufficient role privileges.' });
            }

            next();
        } catch (err) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = { roleMiddleware };