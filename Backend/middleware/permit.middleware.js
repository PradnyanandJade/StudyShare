
const checkPermission = (...allowedRoles) => {
    return (req , res , next) => {
        try {
            const user = req.user;
            if(!user){
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }
            if(!allowedRoles.includes(user.role)){
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

export default checkPermission;