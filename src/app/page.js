import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl p-10 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Soccer Match Prediction System</h1>
          <p className="text-xl mb-8">
            Powered by advanced machine learning models to predict soccer match outcomes with high accuracy
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/predictions" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Try Predictions
            </Link>
            <Link href="/leagues" className="btn-secondary">
              View Leagues
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-4">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="text-primary-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Match Predictions</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get accurate predictions for upcoming matches based on historical data, team performance, and more.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-primary-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed analysis of team performance, strengths, weaknesses, and historical trends.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-primary-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">League Statistics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive statistics for major leagues including Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-primary-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get the latest data and predictions in real-time, powered by our Google Colab backend.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-primary-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generate comprehensive reports with key insights and visualization of prediction confidence.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-primary-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track the accuracy of our prediction models over time with detailed analytics.
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-6">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:space-x-10">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-4 h-72 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 italic">Model Architecture Visualization</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <ol className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">1</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Data Collection</h4>
                    <p className="text-gray-600 dark:text-gray-300">Historical match data, team statistics, player performance, and external factors are collected.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">2</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Feature Engineering</h4>
                    <p className="text-gray-600 dark:text-gray-300">Raw data is transformed into meaningful features for the prediction models.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">3</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Model Training</h4>
                    <p className="text-gray-600 dark:text-gray-300">Machine learning models are trained on Google Colab using historical data patterns.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">4</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">Prediction Generation</h4>
                    <p className="text-gray-600 dark:text-gray-300">Models generate predictions with confidence scores for upcoming matches.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-secondary-100 dark:bg-secondary-800 rounded-xl p-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to predict your next match?</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Start using our soccer prediction system powered by Google Colab machine learning models.
          </p>
          <Link href="/predictions" className="btn-primary">
            Make a Prediction
          </Link>
        </div>
      </section>
    </div>
  );
}