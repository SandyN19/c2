const { addToPendingList } = require('../src/cli');
const mysql = require('promise-mysql');
let connection;

describe('addToPendingList', () => {
  beforeAll(async () => {
    // Set up the database connection
    connection = await mysql.createConnection({
      host:     "sandy.local",
      user:     "dbadm",
      password: "P@ssw0rd",
      database: "c2"
    });
  });

  afterAll(async () => {
    if (connection) {
      await connection.end();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('should not add a client to pending list if watchlist is true', async () => {
  const mockClientInfo = {
    clientid: 'client',
    platform: 'linux',
    release: '1.0',
    location: '56.8746:14.8124'
  };

  const checkWatchlistSpy = jest.spyOn(require('../src/cli'), 'checkWatchlist');
  checkWatchlistSpy.mockResolvedValueOnce(true);

  const result = await addToPendingList(mockClientInfo);

  expect(result).toBeNull();

  const [addedClient] = await connection.query('SELECT * FROM pending_clients WHERE clientid = ?', ['client']);
  expect(addedClient).toBeFalsy();
  });
});
