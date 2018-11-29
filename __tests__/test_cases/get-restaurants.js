import { invokeGetRestaurants } from '../steps/InvokeHelper';
import initEvns from '../steps/InitialEnvs';

describe('get-index: invoke the Get / endpoint', () => {
  beforeAll(async () => {
    await initEvns();
  });

  test('invoke get-restaurants has 8 result', async () => {
    const res = await invokeGetRestaurants();

    expect(res.statusCode).toBe(200);
    expect(res.body).not.toBeNull();
    expect(res.body.Items.length).toBe(8);
    res.body.Items.forEach(restaurant => {
      expect(Object.prototype.hasOwnProperty.call(restaurant, 'name')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(restaurant, 'image')).toBe(true);
    });
  });
});