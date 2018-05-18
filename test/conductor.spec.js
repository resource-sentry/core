const Promise = require('bluebird');

const Conductor  = require('../src/conductor'),
      MockReader = require('./mock-reader'),
      MockWriter = require('./mock-writer');

describe('Conductor', () => {

    let conductor;

    beforeAll(() => {
        conductor = new Conductor();

        return Promise.all([
            conductor.registerReader(new MockReader()),
            conductor.registerWriter(new MockWriter())
        ]);
    });

    it('writes from all sources', () => {
        let spy = jest.spyOn(conductor, 'writeNow');

        conductor.invalidate();
        conductor.invalidate();

        return Promise
            .resolve()
            .delay(60)
            .then(() => {
                expect(spy).toHaveBeenCalledTimes(2);

                spy.mockReset();
                spy.mockRestore();
            });
    });

});
