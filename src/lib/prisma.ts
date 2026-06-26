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
  hashedPassword: 'test',
  salt: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'egriebl@terpmail.umd.edu',
  name: 'Eva Griebl',
  hashedPassword: 'test',
  salt: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'mjasti12@terpmail.umd.edu',
  name: 'Mahitha Jasti',
  hashedPassword: 'test',
  salt: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'ashah150@terpmail.umd.edu',
  name: 'Angad Shah',
  hashedPassword: 'test',
  salt: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'vsampath@terpmail.umd.edu',
  name: 'Vidhu Sampath',
  hashedPassword: 'test',
  salt: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'nimeesh@terpmail.umd.edu',
  name: 'Nimmesh Sharma',
  hashedPassword: 'test',
  salt: 'test',
  role: 'PLEDGE' as const
}, {
  email: 'nshyam@terpmail.umd.edu',
  name: 'Nikhil Shyam',
  hashedPassword: 'test',
  salt: 'test',
  role: 'BROTHER' as const
}];

const users = [{
  email: 'hpadgett@terpmail.umd.edu',
  name: 'Harrison Padgett',
  hashedPassword: 'test',
  salt: 'test',
  role: 'OWNER' as const,
  membershipCommittee: true
}, {
  email: 'asamaga@terpmail.umd.edu',
  name: 'Amogh Samaga',
  hashedPassword: 'test',
  salt: 'test',
  role: 'BROTHER' as const,
  membershipCommittee: true
}, {
  email: 'cmathew5@terpmail.umd.edu',
  name: 'Christa Mathew',
  hashedPassword: 'test',
  salt: 'test',
  role: 'BROTHER' as const,
  membershipCommittee: false
}, {
  email: 'echo1236@terpmail.umd.edu',
  name: 'Emma Cho',
  hashedPassword: 'test',
  salt: 'test',
  role: 'PCP_PCVP' as const,
  membershipCommittee: false
}, {
  email: 'pverma1@terpmail.umd.edu',
  name: 'Pratham Verma',
  hashedPassword: 'test',
  salt: 'test',
  role: 'NONE' as const,
  membershipCommittee: false
}];

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
  // await prisma.user.createMany({ data: pledges, skipDuplicates: true });
  // await prisma.strikeEvent.createMany({ data: strikes, skipDuplicates: true });
  // await prisma.user.createMany({ data: users, skipDuplicates: true });
}

// test().catch(console.error).finally(() => prisma.$disconnect);
