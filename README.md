# Cortex Cloud - AI-Powered Business Automation Platform

A modern, full-stack business automation platform built with React, TypeScript, and Supabase. Features intelligent booking systems, CRM capabilities, and AI-powered automation tools.

## 🚀 Features

- **AI-Powered Automation**: Streamline business processes with intelligent automation
- **Smart Booking System**: Advanced calendar integration with conflict detection
- **Unified CRM**: Customer relationship management with real-time updates
- **Admin Dashboard**: Complete management interface for bookings and availability
- **Responsive Design**: Modern, mobile-first UI with glass morphism effects
- **Real-time Updates**: Live data synchronization with Supabase
- **Contact Management**: Lead capture and communication tools

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cortexcloud-online
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL commands from `supabase-setup.sql` in your Supabase SQL Editor
   - This will create all necessary tables, functions, and policies

5. **Start the development server**
   ```bash
npm run dev
```

## 🗄️ Database Setup

The application requires a Supabase database with the following tables:

- `availability`: Manages business hours and availability
- `bookings`: Stores appointment bookings
- `admin_users`: Admin user management (optional)

Run the `supabase-setup.sql` file in your Supabase SQL Editor to set up the complete database schema.

## 📱 Pages & Routes

- `/` - Landing page with features, pricing, and contact information
- `/booking` - Standalone booking widget
- `/admin` - Admin dashboard for managing bookings and availability
- `/*` - 404 error page

## 🎨 Design System

The application uses a custom design system with:

- **Color Palette**: Dark theme with cyan/purple gradients
- **Typography**: Modern, clean fonts with gradient text effects
- **Components**: Glass morphism effects with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design with breakpoint optimization

## 🔧 Key Components

### Booking System
- **BookingWidget**: Main booking interface with calendar and time selection
- **AvailabilityManager**: Admin interface for setting business hours
- **BookingManager**: Admin interface for managing appointments

### UI Components
- **Header**: Navigation with logo and menu items
- **HeroSection**: Landing page hero with call-to-action
- **ContactSection**: Contact form and business information
- **FeaturesSection**: Product features showcase
- **PricingSection**: Pricing plans and packages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure environment variables on your hosting platform

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key | Yes |
| `VITE_EMAIL_SERVICE_URL` | Email service endpoint (optional) | No |
| `VITE_EMAIL_API_KEY` | Email service API key (optional) | No |

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@cortexcloud.com
- Documentation: [docs.cortexcloud.com](https://docs.cortexcloud.com)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🔮 Roadmap

- [ ] User authentication and authorization
- [ ] Email notifications and confirmations
- [ ] Google Calendar integration
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] API documentation
- [ ] Webhook integrations

---

Built with ❤️ by the Cortex Cloud team