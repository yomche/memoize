export function memoize(inFunc) {
    if (typeof inFunc !== 'function') {
        return null;
    }
    const cache = new Map();
    return function outFunc(x) {
        if (cache.has(x)) {
            return cache.get(x);
        }
        const result = inFunc.call(this, x);
        cache.set(x, result);
        return result;
    };
}
