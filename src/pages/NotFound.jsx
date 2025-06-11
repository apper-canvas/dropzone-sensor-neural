import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="FileX" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-heading font-bold text-surface-900">404</h1>
          <h2 className="text-xl font-semibold text-surface-700">Page Not Found</h2>
          <p className="text-surface-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-lg gradient-primary text-white font-medium shadow-lg
                     hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Home" size={16} />
            <span>Go Home</span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default NotFound;