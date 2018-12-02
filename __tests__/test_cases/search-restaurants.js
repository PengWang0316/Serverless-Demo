import { invokeSearchRestaurants } from '../steps/InvokeHelper';
import initEvns from '../steps/InitialEnvs';
import { registerUser, deleteUser } from '../steps/CognitoUserHelper';

let user;

describe('get-index: invoke the Get / endpoint', () => {
  beforeAll(async () => {
    await initEvns();
    user = await registerUser();
  });

  afterAll(async () => {
    await deleteUser(user);
  });

  test('invoke search-restaurants function', async () => {
    const res = await invokeSearchRestaurants('cartoon', user.idToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.Items.length).toBe(4);

    res.body.Items.forEach(restaurant => {
      expect(Object.prototype.hasOwnProperty.call(restaurant, 'name')).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(restaurant, 'image')).toBe(true);
    });
  });
});
