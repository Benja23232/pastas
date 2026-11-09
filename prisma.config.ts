import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrations: {
    seed: 'npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    url: "postgresql://postgres.dkooqbvpluhsgtwxwidl:Juampi1234%23%23@aws-0-us-east-1.pooler.supabase.com:5432/postgres", // Reemplazá con tus datos
  },
})