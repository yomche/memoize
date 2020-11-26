export function memoize(inFunc) {
    if (typeof inFunc !== 'function') {
        return null;
    }
    const cache = {};
    return function outFunc(...args) {
        const key = JSON.stringify(args);
        if (key in cache) {
            return cache[key];
        }
        const result = inFunc.apply(this, args);
        cache[key] = result;
        return result;
    };
}
