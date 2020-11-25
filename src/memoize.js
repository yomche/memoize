export function memoize(inFunc) {
    if (typeof inFunc !== 'function') {
        return null;
    }
    const cache = new Map();
    return function outFunc(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = inFunc.apply(this, args);
        cache.set(key, result);
        return result;
    };
}
