const ormConfig = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'gastos',
  synchronize: true,
  entities: ['src/model/*{.ts, .js}'],
}

export = ormConfig
