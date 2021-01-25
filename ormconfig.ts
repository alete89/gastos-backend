const isProductionEnv = () => process.env.NODE_ENV === 'production'

const extra = isProductionEnv() ? { ssl: { rejectUnauthorized: false } } : {}

const entities = isProductionEnv()
  ? ['build/src/model/*.js']
  : ['src/model/*.ts']


module.exports = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL || process.env.DEV_DATABASE_URL,
  entities,
  synchronize: true,
  ssl: isProductionEnv(),
  extra
};
