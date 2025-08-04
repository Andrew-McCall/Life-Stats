import postgres from 'postgres'

const sql = postgres({}) 

export async function initializeDatabase() {
  let needsInit = false;

  try {
    await sql`SELECT 1 FROM counter LIMIT 1`;
    console.log("Database already initialized.");
  } catch (err) {
    needsInit = err.code === "42P01"; // undefined_table
    if (!needsInit) {
      // Unexpected error — rethrow
      throw err;
    }
  }

  if (needsInit) {
    console.log("Database not initialized, creating schema...");

    const sqlFilePath = path.resolve(process.cwd(), "../database.sql");
    const sqlFileContent = fs.readFileSync(sqlFilePath, "utf-8");

    await sql.unsafe(sqlFileContent);

    console.log("Database schema created.");
  }
}

export default sql

