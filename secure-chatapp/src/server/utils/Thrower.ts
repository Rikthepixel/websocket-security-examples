const Thrower = (name: string, message: string) => {
    const err = new Error(message);
    err.name = name;
    throw err;
};

export const ThrowServer = () => {
    return Thrower("500", "Internal Server Error");
};

export const ThrowBadRequest = (reason: string) => {
    return Thrower("400", reason);
};

export default Thrower; 