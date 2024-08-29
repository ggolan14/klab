export const formatPrice = (price, currency) => {
    switch (currency) {
        case '£':
            return `${currency}${price}`;
        case '$':
        case '€':
            return `${price}${currency}`;
        default:
            throw new Error('Unsupported currency');
    }
};