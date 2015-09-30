import {describe, beforeEach, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';
import {memoize} from './memoize';

describe('memoize', () => {
    it('should be a function', () => {
        expect(memoize).to.be.a('function');
    });

    it('should return undefined if no function provided', () => {
        [undefined, null, 123, {}].forEach((arg) => {
            expect(memoize(arg)).to.be.an('null');
        });
    });

    it('should return some function if function was provided', () => {
        expect(memoize(() => {})).to.be.a('function');
    });

    describe('should return chached function that', () => {
        function abs(...xs) {
            const power = xs.map(x => x * x).reduce((sum, x) => sum + x);
            return Math.round(Math.sqrt(power));
        }

        function grep(pattern, ...items) {
            if (!(pattern instanceof RegExp)) { // Special case
                return null;
            }
            return items.map(String).filter(item => pattern.test(item));
        }

        let absSpy;
        let grepSpy;
        let memoizedAbs;
        let memoizedGrep;

        beforeEach(() => {
            absSpy = sinon.spy(abs);
            memoizedAbs = memoize(absSpy);
            grepSpy = sinon.spy(grep);
            memoizedGrep = memoize(grepSpy);
        });

        it('is not equal to the original function', () => {
            expect(memoize(abs))
                .to.be.a('function')
                .and.to.not.equal(abs);
        });

        it('delegates calls to the target function', () => {
            expect(memoizedAbs(0, 1)).to.equal(1);
            expect(memoizedAbs(3, 4)).to.equal(5);
            expect(memoizedGrep(/\d+/, 'abc', '123', 'def')).to.deep.equal(['123']);
        });

        it('delegates calls preserving context', () => {
            const ctx = {};
            expect(ctx::memoizedAbs(0, 1)).to.equal(1);
            sinon.assert.calledOn(absSpy, ctx);
        });

        it('returns correct values in case of the consequent calls with identical arguments', () => {
            expect(memoizedAbs(7)).to.equal(7); // #1
            expect(memoizedAbs(3, 4)).to.equal(5); // #2
            expect(memoizedAbs(3, 4)).to.equal(5); // #2
            expect(memoizedAbs(4, 3)).to.equal(5); // #3
            expect(memoizedAbs(4, 3)).to.equal(5); // #3
            expect(memoizedAbs(3, 4)).to.equal(5); // #2
            expect(memoizedAbs(4, 3)).to.equal(5); // #3
            expect(memoizedAbs(7)).to.equal(7); // #1
            sinon.assert.callCount(absSpy, 3);
        });

        it('caches empty result as legal value', () => {
            expect(memoizedGrep(undefined)).to.be.a('null');
            expect(memoizedGrep(undefined)).to.be.a('null');
            sinon.assert.calledOnce(grepSpy);
        });

        it('caches results of the consequent calls with identical arguments', () => {
            expect(memoizedAbs(3, 4)).to.equal(5); // #1
            sinon.assert.calledWith(absSpy, 3, 4);
            sinon.assert.calledOnce(absSpy);
            absSpy.reset();
            expect(memoizedAbs(3, 4)).to.equal(5); // #2
            sinon.assert.notCalled(absSpy);
        });

        it('uses all arguments to compute cache key', () => {
            const N = 10;
            for (let n = 1; n <= N; n += 1) {
                const args = range(n);
                memoizedAbs(...args);
                sinon.assert.calledWith(absSpy, ...args);
                sinon.assert.callCount(absSpy, n);
            }
            absSpy.reset();
            for (let n = 1; n <= N; n += 1) {
                memoizedAbs(...range(n));
            }
            sinon.assert.notCalled(absSpy);

            function range(n) {
                return n > 0 ? [n, ...range(n - 1)] : [];
            }
        });

        it('uses complicated enough key generator to distinguish different types', () => {
            const args1 = [/\d+/, '1', 2, true];
            expect(memoizedGrep(...args1)).to.deep.equal(['1', '2']); // #1
            sinon.assert.calledWith(grepSpy, ...args1);
            sinon.assert.calledOnce(grepSpy);
            const args2 = [/\d+/, 1, '2', true];
            expect(memoizedGrep(...args2)).to.deep.equal(['1', '2']); // #2
            sinon.assert.calledWith(grepSpy, ...args2);
            sinon.assert.calledTwice(grepSpy);
            grepSpy.reset();
            expect(memoizedGrep(...args2)).to.deep.equal(['1', '2']); // #2
            sinon.assert.notCalled(grepSpy);
        });

        it('uses complicated enough key generator to preserve argument order', () => {
            expect(memoizedAbs(4, 3)).to.equal(5); // #1
            sinon.assert.calledWith(absSpy, 4, 3);
            sinon.assert.calledOnce(absSpy);
            expect(memoizedAbs(3, 4)).to.equal(5); // #2
            sinon.assert.calledWith(absSpy, 3, 4);
            sinon.assert.calledTwice(absSpy);
            absSpy.reset();
            expect(memoizedAbs(3, 4)).to.equal(5); // #2
            sinon.assert.notCalled(absSpy);
        });
    });
});
