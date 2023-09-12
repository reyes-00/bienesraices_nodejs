import {DataTypes} from 'sequelize';
import db from '../config/db.js';
// Define el modelo de la tabla en la base de datos
const ExcelData = db.define('ExcelData', {
  EAN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DESCRIPCION: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ASINN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FECHA_CRT: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  // Define más columnas según tus necesidades
});

export default ExcelData
