export function getIsButtonDisabled(pageFlow, currentIndex) {
    if (!currentIndex || currentIndex === 0) {
        return false;
    }
    return !(pageFlow[currentIndex - 1].output);
}
