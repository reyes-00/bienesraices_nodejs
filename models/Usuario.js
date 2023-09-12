import {DataTypes} from 'sequelize'
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const Usuario = db.define('usuarios',{
  nombre:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  email:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  password:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: DataTypes.STRING,
  confirmado: DataTypes.BOOLEAN

}, {
  hooks: {
    beforeCreate: async function(usuario){
      const salt = await bcrypt.genSalt(10)
      usuario.password = await bcrypt.hash(usuario.password, salt)
    }
  },

  //El propósito de este código es definir un conjunto de atributos que deben ser excluidos
  scopes:{
      eliminarPassword:{
        attributes:{
          exclude: ["password", "token","confirmado","createdAt", "updatedAt"]
        }
      }
  }

})

//Metodos personalizados

Usuario.prototype.verificarPassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

export default Usuario