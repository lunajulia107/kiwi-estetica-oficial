const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
};
