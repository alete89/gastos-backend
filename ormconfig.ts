const entities = process.env.NODE_ENV === 'production'
  ? ['build/src/model/*.js']
  : ['src/model/*.ts']

module.exports = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL || process.env.DEV_DATABASE_URL,
  entities,
  synchronize: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
