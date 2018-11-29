import { invokeSearchRestaurants } from '../steps/InvokeHelper';
import initEvns from '../steps/InitialEnvs';

describe('get-index: invoke the Get / endpoint', () => {
  beforeAll(async () => {
    await initEvns();
  });

  test('invoke search-restaurants function', async () => {
    const res = await invokeSearchRestaurants('cartoon');

    expect(res.statusCode).toBe(200);
    expect(res.body.Items.length).toBe(4);

    res.body.Items.forEach(restaurant => {
      expect(Object.prototype.hasOwnProperty.call(restaurant, 'name')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(restaurant, 'image')).toBe(true);
    });
  });
});
