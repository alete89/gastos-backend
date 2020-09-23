module.exports = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'gastos',
  synchronize: true,
  entities: ['src/model/*{.ts, .js}'],
}
