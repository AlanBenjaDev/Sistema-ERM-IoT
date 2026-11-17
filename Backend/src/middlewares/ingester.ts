import { Database } from 'duckdb-async';


export async function inspectCsvColumns(filePath: string): Promise<string[]> {
  const db = await Database.create(':memory:');
  
  const columnsData = await db.all(`
    DESCRIBE SELECT * FROM read_csv_auto('${filePath}');
  `);

  return columnsData.map((col: any) => col.column_name);
}


export async function queryCsvData(
  filePath: string, 
  selectedColumns: string[], 
  limit: number = 50
): Promise<any[]> {
  const db = await Database.create(':memory:');

  const safeColumns = selectedColumns.map((col) => `"${col}"`).join(', ');

  const query = `
    SELECT ${safeColumns} 
    FROM read_csv_auto('${filePath}') 
    LIMIT ${limit};
  `;

  const results = await db.all(query);
  return results;
}

