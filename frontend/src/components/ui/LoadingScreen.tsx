import { motion } from 'framer-motion';
import logoYayasan from '../../assets/logoyayasan.png';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-offwhite flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-[2px] border-dashed border-primary/30 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 relative z-10"
          >
            <img 
              src={logoYayasan} 
              alt="Loading" 
              className="w-full h-full object-contain drop-shadow-lg" 
            />
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            ))}
          </motion.div>
          <span className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-2">
            Memuat
          </span>
        </div>
      </motion.div>
    </div>
  );
}
