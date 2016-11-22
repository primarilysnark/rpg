export class SqlService {
  constructor({ connection }) {
    this.connection = connection;
  }

  _beginTransaction = () => new Promise((resolve, reject) => {
    this.connection.beginTransaction(error => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });

  _commitTransaction = (results) => new Promise((resolve, reject) => {
    this.connection.commit(error => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  });

  _query = (query, values) => new Promise((resolve, reject) => {
    this.connection.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  });
}
