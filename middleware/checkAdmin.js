module.exports.isAdmin = (req, res ,next) => {

    try {
        const { role } = req.user;

        if ( role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                error: {
                    message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะผู้ดูแลระบบเท่านั้น'
                }
            })
        }
        
    } catch (error) {
        next(error);
    }
}