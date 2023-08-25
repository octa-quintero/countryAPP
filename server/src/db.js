require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST
} = process.env;

// Configuración de Sequelize para la conexión a la base de datos
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/countries`, {
    logging: false,
    native: false,
});

// Cargar modelos de la carpeta 'models'
const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

  // Asociar modelos a la instancia de Sequelize
modelDefiners.forEach(model => model(sequelize));

// Convertir nombres de modelos a notación CamelCase
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// Definición de modelos específicos
const { Countries, TouristActivity } = sequelize.models;

// Definir relaciones entre modelos
TouristActivity.belongsToMany(Countries, { through: "country_activity" });
Countries.belongsToMany(TouristActivity, { through: "country_activity" });


module.exports = {
  ...sequelize.models,
  conn: sequelize,
  Op
}

