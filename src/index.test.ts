import { Monochan } from './index';

test('#send', async () => {
  const chan = new Monochan<string>();

  const msg = 'hello';
  const promises = new Array<Promise<string>>();

  promises.push(
    new Promise(resolve => {
      chan.wait().then(got => {
        expect(got).toBe(msg);
        resolve();
      });
    }),
  );

  promises.push(
    new Promise(async resolve => {
      const got = await chan.wait();
      expect(got).toBe(msg);
      resolve();
    }),
  );

  chan.send(msg);

  await Promise.all(promises);
});

test('#raise', async () => {
  const chan = new Monochan<string>();

  const err = new Error('error!!');
  const promises = new Array<Promise<string>>();

  promises.push(
    new Promise(resolve => {
      chan.wait().catch(got => {
        expect(got).toBe(err);
        resolve();
      });
    }),
  );

  promises.push(
    new Promise(async resolve => {
      try {
        await chan.wait();
        expect('here is unreachable').toBe('but it reached');
      } catch (caught) {
        expect(caught).toBe(err);
      }
      resolve();
    }),
  );

  chan.raise(err);

  await Promise.all(promises);
});

test('send and raise multiple time', async () => {
  const chan = new Monochan<string>();

  const msg1 = 'hello';
  const promises = new Array<Promise<string>>();

  promises.push(
    new Promise(resolve => {
      chan.wait().then(got => {
        expect(got).toBe(msg1);
        resolve();
      });
      chan.send(msg1);
    }),
  );

  const err1 = 'err1';
  promises.push(
    new Promise(resolve => {
      chan.wait().catch(got => {
        expect(got).toBe(err1);
        resolve();
      });
      chan.raise(err1);
    }),
  );

  const msg2 = 'goodbye';
  promises.push(
    new Promise(resolve => {
      chan.wait().then(got => {
        expect(got).toBe(msg2);
        resolve();
      });
      chan.send(msg2);
    }),
  );

  const err2 = 'err2';
  promises.push(
    new Promise(resolve => {
      chan.wait().catch(got => {
        expect(got).toBe(err2);
        resolve();
      });
      chan.raise(err2);
    }),
  );

  await Promise.all(promises);
});
