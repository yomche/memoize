export function memoize(inFunc) {
    if (typeof inFunc !== 'function') {
        return null;
    }
    const cache = new Map();
    return function outFunc(...args) {
        if (cache.has(args)) {
            return cache.get(args);
        }
        const result = inFunc.apply(this, args);
        cache.set(args, result);
        return result;
    };
}
