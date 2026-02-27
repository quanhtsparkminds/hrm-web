import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gifs } from "@/assets";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Loading: React.FC = () => {
  const { isLoading, loadingMessage } = useSelector(
    (state: RootState) => state.ui,
  );

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-20 bg-primary/20 rounded-full blur-[80px] animate-pulse" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="relative z-10 w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-primary/30 to-background/30 border border-primary/20 shadow-2xl glass-effect"
            >
              <img
                src={gifs.loader}
                alt="Loading..."
                className="w-full h-full object-cover rounded-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground animate-pulse">
                {loadingMessage || "Hệ thống đang xử lý"}
              </p>
              <div className="mt-2 flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
