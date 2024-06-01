export const validateBody = (schema) => {
    return function handleBody(req, res, next) {
        try {
            console.log("req.body is " + req.body);
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    };
};
