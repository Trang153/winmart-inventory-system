const fs = require("fs");
const path = require("path");

const useTrustedConnection = process.env.DB_TRUSTED_CONNECTION === "true";

let sql;

try {
  sql = useTrustedConnection ? require("mssql/msnodesqlv8") : require("mssql");
} catch (error) {
  throw new Error(
    useTrustedConnection
      ? "Trusted connection requires `msnodesqlv8`. Run: npm install msnodesqlv8"
      : error.message
  );
}

const serverName = process.env.DB_INSTANCE
  ? `${process.env.DB_SERVER}\\${process.env.DB_INSTANCE}`
  : process.env.DB_SERVER;

const baseConfig = {
  server: serverName,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const dbConfig = useTrustedConnection
  ? {
      ...baseConfig,
      driver: "msnodesqlv8",
      options: {
        ...baseConfig.options,
        trustedConnection: true,
      },
    }
  : {
      ...baseConfig,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT || 1433),
    };

let pool;
let isInitialized = false;

function createConfig(databaseName) {
  const config = {
    ...dbConfig,
    database: databaseName,
  };

  if (!useTrustedConnection) {
    config.port = Number(process.env.DB_PORT || 1433);
  }

  return config;
}

function splitSqlBatches(script) {
  return script
    .split(/^\s*GO\s*$/gim)
    .map((batch) => batch.trim())
    .filter(Boolean);
}

async function runSqlScript(filePath) {
  const script = fs.readFileSync(filePath, "utf8");
  const batches = splitSqlBatches(script);
  let currentDatabase = "master";
  let bootstrapPool = await new sql.ConnectionPool(
    createConfig(currentDatabase)
  ).connect();

  try {
    for (const batch of batches) {
      const useMatch = batch.match(/^USE\s+\[?([^\]\s;]+)\]?;?$/i);

      if (useMatch) {
        currentDatabase = useMatch[1];
        await bootstrapPool.close();
        bootstrapPool = await new sql.ConnectionPool(
          createConfig(currentDatabase)
        ).connect();
        continue;
      }

      await bootstrapPool.request().query(batch);
    }
  } finally {
    if (bootstrapPool && bootstrapPool.connected) {
      await bootstrapPool.close();
    }
  }
}

async function initializeDatabase() {
  if (isInitialized) {
    return;
  }

  const scriptPath = path.resolve(__dirname, "../../sql/create_schema.sql");
  await runSqlScript(scriptPath);
  isInitialized = true;
}

async function connectDB() {
  if (pool) {
    return pool;
  }

  await initializeDatabase();
  pool = await new sql.ConnectionPool(createConfig(process.env.DB_NAME)).connect();
  return pool;
}

async function query(text, params = {}) {
  const connection = await connectDB();
  const request = connection.request();

  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });

  return request.query(text);
}

module.exports = {
  sql,
  dbConfig,
  connectDB,
  initializeDatabase,
  query,
};
