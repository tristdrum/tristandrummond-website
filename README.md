Tristan Drummond - Personal Website

Overview

This repository contains the source code for tristandrummond.com, a personal website for Trist Drummond. The site is built using Next.js and Supabase and is hosted on Vercel. It features a minimalist design, dynamic content, and an interactive homepage for easy navigation between different sections, including articles on AI, tech, faith, and personal reflections.

Features

	•	Interactive Wheel Navigation: An engaging homepage element where each segment represents a different section of the site, changing color and displaying a label on hover.
	•	Content Sections: Separate pages for Tech & AI insights, Faith & Community reflections, and Life & Reflections.
	•	Dynamic Content Management: All content is managed through Supabase, making updates simple without needing code changes.
	•	Responsive Design: Fully responsive, ensuring a great experience on both desktop and mobile devices.
	•	Dark Mode Support: Automatic dark mode based on user’s system preferences.

Tech Stack

	•	Frontend: Next.js with the App Router
	•	Backend: Supabase (data storage and dynamic content)
	•	Hosting: Vercel
	•	Design: Custom minimalist styling using CSS with a focus on simplicity and readability.

Getting Started

Prerequisites

	•	Node.js (version 16+)
	•	Supabase Account (for database setup)
	•	Vercel Account (for hosting)

Installation

	1.	Clone the repository:

git clone https://github.com/your-username/tristandrummond-website.git
cd tristandrummond-website


	2.	Install dependencies:

npm install


	3.	Set up environment variables:
Create a .env file in the root directory and add the following:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


	4.	Run the development server:

npm run dev

The website will be available at http://localhost:3000.

Database Setup

	1.	Create a Supabase project: Go to Supabase and create a new project.
	2.	Set up tables: Create tables for storing blog posts, quick thoughts, and interactive wheel data.
	3.	Import initial content: Add your initial articles, reflections, and wheel segment data directly through the Supabase dashboard.

Deployment

	1.	Connect to Vercel: Log in to Vercel and import your repository.
	2.	Set environment variables: Add the same environment variables from your .env file in the Vercel project settings.
	3.	Deploy: Click Deploy to build and host the website on Vercel.

Future Enhancements

	•	User Authentication: Allow users to create accounts for personalized content.
	•	Paid Subscriptions: Introduce exclusive content for subscribers.
	•	Newsletter Integration: Enable visitors to subscribe to updates directly from the site.

Contributing

If you’d like to contribute, feel free to fork the repository and submit a pull request. All contributions are welcome!

License

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements

	•	Supabase for the easy-to-use database services.
	•	Next.js and Vercel for providing a powerful framework and seamless deployment.

Contact

For any inquiries or feedback, reach out to me at [hello@tristandrummond.com].
