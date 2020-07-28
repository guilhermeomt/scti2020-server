const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const { resolve } = require('path');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');
const createDbConnection = require('./connection');
const logger = require('../utils/logger');
const User = require('../models/user');
const Speaker = require('../models/speaker');
const Event = require('../models/event');

dotenv.config({
  path: resolve(__dirname, '..', '..', 'config.private_dev.env'),
});

const loadData = () => {
  const loadedData = {};

  loadedData.users = JSON.parse(
    readFileSync(resolve(__dirname, 'data', 'users.json'), 'utf-8')
  );
  loadedData.events2019 = JSON.parse(
    readFileSync(resolve(__dirname, 'data', 'events2019.json'), 'utf-8')
  );
  loadedData.speakers2019 = JSON.parse(
    readFileSync(resolve(__dirname, 'data', 'speakers2019.json'), 'utf-8')
  );

  return loadedData;
};

const seedData = () => {
  const data = loadData();

  logger.info('Seeding data...', { label: 'data' });

  Promise.resolve(
    User.create(data.users, { validateBeforeSave: true }),
    Event.create(data.events2019, { validateBeforeSave: true }),
    Speaker.create(data.speakers2019, { validateBeforeSave: true })
  )
    .then(() => {
      logger.info('Data is now seeded into database!', { label: 'data' });
      process.exit(0);
    })
    .catch((err) => {
      logger.error(err.message, { label: 'data' });
      process.exit(1);
    });
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Event.deleteMany();
  } catch (err) {
    logger.error(err.message, { label: 'data' });
    process.exit(1);
  }

  logger.info(
    `Deleted all data from ${User.collection.collectionName} and ${Event.collection.collectionName} collections`,
    { label: 'data' }
  );
  process.exit(0);
};

if (process.argv[2] === '--seed' || process.argv[2] === '-s') {
  createDbConnection(process.env.MONGO_URI);
  seedData();
} else if (process.argv[2] === '--delete' || process.argv[2] === '-d') {
  logger.warn('', { label: 'data' });

  readline.question(
    'Are you sure you want to continue? This will possibly delete ALL data stored in database (y/n): ',
    (answer) => {
      if (answer === 'y') {
        createDbConnection(process.env.MONGO_URI);
        deleteData();
      }
    }
  );
}
