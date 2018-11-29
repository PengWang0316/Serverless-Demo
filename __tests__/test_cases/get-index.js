import { invokeGetIndex } from '../steps/when';
import initEvns from '../steps/InitialEnvs';

describe('get-index: invoke the Get / endpoint', () => {
  beforeAll(async () => {
    await initEvns();
  });
  test('Should return the index page with 8 restaurants', async () => {
    const res = await invokeGetIndex();

    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('text/html; charset=UTF-8');
    expect(res.body).not.toBeNull();
  });
});
