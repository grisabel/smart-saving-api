import axios from 'axios';

describe('GET /status', () => {
  it('should return a OK', async () => {
    const res = await axios.get(`/status`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ status: 'OK' });
  });
});
