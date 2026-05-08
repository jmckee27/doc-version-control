# doc-version-control
A cloud-deployed web application for tracking versions of plaintext (.txt) and Microsoft Word (.docx) documents. Users can upload successive drafts of an assignment, browse the version history, and download or compare any version.

## Architecture 
This the **frontend** repository, the application is split across two repos:

**Frontend** (this repo): Next.js application providing the user interface
**Backend**: https://github.com/EvanYeager/doc-vc-backend

The full system uses:
**Next.js** frontend deployed to Azure App Service
**Azure Functions** backend (HTTP-triggered, Node.js runtime)
**Azure SQL Database** for users, assignments, and version metadata
**Azure Blob Storage** for actual document files
**JWT-based authentication** for protected upload endpoints

*This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Prerequisities
- Node.js 18+
- A running instance of the [backend](https://github.com/EvanYeager/doc-vc-backend) (or access to deployed one)

### Setup 

1. Clone the repo:
```bash
   git clone https://github.com/EvanYeager/doc-version-control.git
   cd doc-version-control
   npm install
```
2. Create `.env.local` in the project root:
3. Run development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/page.tsx` — Dashboard (lists user's assignments)
- `app/login/page.tsx` — Login form
- `app/upload/page.tsx` — Document upload (chains uploadFile + makeVersion API calls)
- `app/documents/[id]/page.tsx` — Assignment detail with version history
- `app/compare/page.tsx` — Version diff viewer (planned)
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## GROUP SPRINT SCHEDULE

- Week 1 (March 30 - April 5): Set up Azure environment, configure services, and initialize GitHub repository
- Week 2 (April 6 - April 12): Develop backend APIs and database schema
- Week 3 (April 13 - April 19): Implement file upload functionality and integrate Azure Blob Storage
- Week 4 (April 20 - April 26): Develop version comparison feature and frontend UI components
- Week 5 (April 27 - May 3): Conduct testing, debugging, and performance improvements
- Week 6 (May 4 - May 10): Finalize application and prepare presentation


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Azure Redeploy Trigger

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Azure Redeploy Trigger 5
