export const validateBody = (schema) => {
    return function handleBody(req, res, next) {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    };
};
