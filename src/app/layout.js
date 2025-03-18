import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Soccer Match Prediction System',
  description: 'Predict soccer match outcomes with machine learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary-700 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Soccer Prediction System</h1>
              <nav>
                <ul className="flex space-x-6">
                  <li><a href="/" className="hover:text-primary-200">Home</a></li>
                  <li><a href="/predictions" className="hover:text-primary-200">Predictions</a></li>
                  <li><a href="/leagues" className="hover:text-primary-200">Leagues</a></li>
                  <li><a href="/teams" className="hover:text-primary-200">Teams</a></li>
                  <li><a href="/history" className="hover:text-primary-200">History</a></li>
                </ul>
              </nav>
            </div>
          </header>
          
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-secondary-800 text-white py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2">Soccer Prediction System</h3>
                  <p className="text-secondary-300">Powered by machine learning models on Google Colab</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                  <ul className="space-y-1">
                    <li><a href="/" className="text-secondary-300 hover:text-white">Home</a></li>
                    <li><a href="/predictions" className="text-secondary-300 hover:text-white">Predictions</a></li>
                    <li><a href="/about" className="text-secondary-300 hover:text-white">About</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-secondary-700 text-center text-secondary-400">
                &copy; {new Date().getFullYear()} Soccer Prediction System. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}