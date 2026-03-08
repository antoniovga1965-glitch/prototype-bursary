const adminjwt = (req, res, next) => {
    if(!req.user){
        return res.status(401).json({ message: 'un-authorized' });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

module.exports = adminjwt;