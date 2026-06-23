import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;

const pledges = [{
  email: 'rsinupil@terpmail.umd.edu',
  name: 'Rishi Sinu Pillai',
  passwordHash: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'egriebl@terpmail.umd.edu',
  name: 'Eva Griebl',
  passwordHash: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'mjasti12@terpmail.umd.edu',
  name: 'Mahitha Jasti',
  passwordHash: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'ashah150@terpmail.umd.edu',
  name: 'Angad Shah',
  passwordHash: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'vsampath@terpmail.umd.edu',
  name: 'Vidhu Sampath',
  passwordHash: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'nimeesh@terpmail.umd.edu',
  name: 'Nimmesh Sharma',
  passwordHash: 'test',
  role: 'PLEDGE' as const
},]

async function test() {
  await prisma.user.createMany({ data: pledges, skipDuplicates: true });
}

test().catch(console.error).finally(() => prisma.$disconnect);
