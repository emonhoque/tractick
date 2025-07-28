import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] p-6">
    <div className="max-w-md w-full text-center">
      <h1 className="text-6xl font-bold text-[#d90c00] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="inline-block bg-[#d90c00] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b91c1c] transition-colors">
        Go to Homepage
      </Link>
    </div>
  </div>
)

export default NotFoundPage 