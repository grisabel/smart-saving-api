#!/bin/sh
npx prisma generate
npm run db:init
npm run start