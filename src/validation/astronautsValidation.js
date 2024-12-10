const astronautValidation = (name, role) => {
    return validateName(name) && validateRole(role);
};

const validateName = (name) => {
    if (!name) { return false; }
    const namePattern = /^[^\s][a-zA-Z\.' -]+$/;
    return namePattern.test(name) && validateLength(name, 3, 50)
};

const validateRole = (role) => {
    if (!role) { return false; }
    const rolePattern = /^[^\s][a-zA-Z\.' -]+$/;
    return rolePattern.test(role) && validateLength(role, 3, 50);
};

const validateLength = (value, minLength, maxLength) => {
    value = String(value);
    if (minLength) {
        if (value.length < minLength) { return false; }
    }
    if (maxLength) {
        if (value.length > maxLength) { return false; }
    }
    return true;
};

module.exports = {
    astronautValidation,
    validateName,
    validateRole
};
