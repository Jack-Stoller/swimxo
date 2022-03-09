export function getObj(keyPath, value) {
    return keyPath.split('.').reverse().reduce((a, b) => ({[b]: a}), value);
}