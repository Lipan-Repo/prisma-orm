import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Alice1',
            email: 'alice2@prisma.io',
        },
    })
    console.log(user)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    const shell = require('shelljs');

// Define the source and destination database connection details
const sourceDB = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'source_db'
};

const destDB = {
  host: 'remote-server',
  port: '5432',
  user: 'admin',
  password: 'password',
  database: 'dest_db'
};

// Generate a SQL dump file of the source database
const dumpFileName = 'source_db_dump.sql';
const dumpCmd = `mysqldump -h ${sourceDB.host} -P ${sourceDB.port} -u ${sourceDB.user} -p${sourceDB.password} ${sourceDB.database} > ${dumpFileName}`;
shell.exec(dumpCmd);

// Transfer the dump file to the destination system
const remoteDir = '/home/admin/db_backups';
const transferCmd = `scp ${dumpFileName} ${destDB.user}@${destDB.host}:${remoteDir}`;
shell.exec(transferCmd);

// Import the dump file into the destination database
const importCmd = `psql -h ${destDB.host} -p ${destDB.port} -U ${destDB.user} -d ${destDB.database} < ${remoteDir}/${dumpFileName}`;
shell.exec(importCmd);

// Clean up the dump file
shell.rm(dumpFileName);
