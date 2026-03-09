import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CalculationHistory } from '@/entities/CalculationHistory';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/calculator.sqlite';

const dbDir = path.dirname(path.resolve(DATABASE_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: path.resolve(DATABASE_PATH),
    entities: [CalculationHistory],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}
