const UserModel = require('../models/userModel');

const getAllUsers = (req, res) => {
  UserModel.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  UserModel.getUserById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

const createUser = (req, res) => {
  const user = req.body;
  UserModel.createUser(user, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, ...user });
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const user = req.body;
  UserModel.updateUser(id, user, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario actualizado' });
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  UserModel.deleteUser(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
