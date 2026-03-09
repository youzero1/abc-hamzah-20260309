import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Note } from '@/entities/Note';
import { Category } from '@/entities/Category';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/notes.db';

// Resolve to absolute path
const resolvedDbPath = path.isAbsolute(DATABASE_PATH)
  ? DATABASE_PATH
  : path.join(process.cwd(), DATABASE_PATH);

// Ensure directory exists
const dbDir = path.dirname(resolvedDbPath);
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
    database: resolvedDbPath,
    entities: [Note, Category],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  await seedCategories(dataSource);

  return dataSource;
}

async function seedCategories(ds: DataSource): Promise<void> {
  const categoryRepo = ds.getRepository(Category);
  const count = await categoryRepo.count();

  if (count === 0) {
    const defaultCategories = [
      { name: 'General', color: '#6b7280', description: 'General notes and miscellaneous items' },
      { name: 'Product Ideas', color: '#8b5cf6', description: 'New product concepts and ideas' },
      { name: 'Inventory', color: '#f59e0b', description: 'Inventory tracking and management' },
      { name: 'Suppliers', color: '#10b981', description: 'Supplier information and contacts' },
      { name: 'Marketing', color: '#ef4444', description: 'Marketing strategies and campaigns' },
      { name: 'Orders', color: '#3b82f6', description: 'Order tracking and management' },
    ];

    for (const cat of defaultCategories) {
      const category = categoryRepo.create(cat);
      await categoryRepo.save(category);
    }
  }
}
