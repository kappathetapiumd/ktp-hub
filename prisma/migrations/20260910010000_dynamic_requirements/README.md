# Dynamic requirements rollout

Apply with `npx prisma migrate deploy`, then restart the app with the updated
Prisma client (`npx prisma generate`, also run by `npm run build`). Coordinate
the migration and app rollout: the old application uses the four User columns
that this migration replaces.

The migration runs in one transaction. It creates the requirement and completion
tables, seeds the original four requirements for both brothers and pledges, copies
all true completion values (including inactive members), and then removes the old
columns. Existing group pledge tasks are unaffected.

New requirements default to incomplete for every applicable member. Changing an
audience preserves completion records; non-applicable records are hidden and do
not contribute to totals. Deleting a requirement deletes its completion records.
Clear Progress removes all individual completions while retaining definitions.

The SQL file is prepared for deployment; generating the Prisma client or building
the app does not apply it to a database.
