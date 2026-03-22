const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value) => emailRegex.test((value || '').trim());

const isStrongEnoughPassword = (value) => typeof value === 'string' && value.length >= 8;

export { isValidEmail, isStrongEnoughPassword };
