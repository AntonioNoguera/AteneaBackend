const connection = require('../config/database');

const UserModel = {
  getAllUsers: (callback) => {
    connection.query('SELECT * FROM users', callback);
  },
  getUserById: (id, callback) => {
    connection.query('SELECT * FROM users WHERE id = ?', [id], callback);
  },
  createUser: (user, callback) => {
    connection.query('INSERT INTO users SET ?', user, callback);
  },
  updateUser: (id, user, callback) => {
    connection.query('UPDATE users SET ? WHERE id = ?', [user, id], callback);
  },
  deleteUser: (id, callback) => {
    connection.query('DELETE FROM users WHERE id = ?', [id], callback);
  }
};

module.exports = UserModel;
