# Briefly - Free Team Communication Platform

Briefly is a completely free platform for managing daily team check-ins and briefs. Transform how your team communicates progress with structured daily updates.

## Features

- **Daily Brief Submissions** - Team members submit structured updates covering accomplishments, blockers, and priorities
- **Team Management** - Invite team members and manage your organization
- **Analytics Dashboard** - Track submission rates and team progress
- **Email Reminders** - Automated reminders for team members
- **PDF Export** - Download briefs as formatted PDF reports
- **Customizable Questions** - Tailor brief questions to your team's needs
- **Free Forever** - No payment required, no hidden fees

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Visit `http://localhost:5173` to access the application

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Email**: Resend API for email notifications
- **Deployment**: Netlify

## Local Development

The application includes mock authentication for development when Supabase isn't configured. To use real authentication:

1. Set up Supabase locally: `npx supabase start`
2. Update your `.env` file with the correct Supabase credentials

## License

MIT License - Feel free to use this project for any purpose.