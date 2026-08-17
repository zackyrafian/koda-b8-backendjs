import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import { readdirSync, statSync } from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { 
    ...config, 
    logging: false,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

function loadModels(dir) {
  readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      loadModels(fullPath);
      return;
    }
    if (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.endsWith('.model.cjs') || file.endsWith('.cjs')) &&
      file.indexOf('.test.cjs') === -1
    ) {
      const model = require(fullPath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
}

loadModels(__dirname);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export { sequelize, Sequelize };