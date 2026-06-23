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
}, {
  email: 'nshyam@terpmail.umd.edu',
  name: 'Nikhil Shyam',
  passwordHash: 'test',
  role: 'BROTHER' as const
}];

const myId = 'cmqpyd1pc0006860wn1act4nr';

const strikes = [{
  amount: 6,
  createdById: 'nikhil',
  pledgeId: 'rishi',
  reason: ''
}, {
  amount: 2,
  createdById: 'nikhil',
  pledgeId: 'eva',
  reason: ''
}, {
  amount: 3,
  createdById: 'nikhil',
  pledgeId: 'mahitha',
  reason: ''
}, {
  amount: 1,
  createdById: 'nikhil',
  pledgeId: 'angad',
  reason: ''
}, {
  amount: 0,
  createdById: 'nikhil',
  pledgeId: 'vidhu',
  reason: ''
}, {
  amount: 4,
  createdById: 'nikhil',
  pledgeId: 'nimeesh',
  reason: ''
}]

async function test() {
  await prisma.user.createMany({ data: pledges, skipDuplicates: true });
  await prisma.strikeEvent.createMany({ data: strikes, skipDuplicates: true });
}

// test().catch(console.error).finally(() => prisma.$disconnect);
