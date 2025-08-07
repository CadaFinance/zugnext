import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, useAccount, type Connector } from 'wagmi';
import { FaTimes } from 'react-icons/fa';
import { FaWallet } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletModal({ open, onClose }: WalletModalProps) {
  const { connect, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Filter connectors to show only WalletConnect and MetaMask
  const filteredConnectors = connectors.filter((connector: Connector) => 
    connector.name !== 'Mock Connector' && 
    (connector.name === 'WalletConnect' || connector.name === 'MetaMask')
  );

  // When wallet connects, close modal
  useEffect(() => {
    if (isConnected && address && open) {
      toast.success('Wallet connected!');
      onClose();
    }
  }, [isConnected, address, open, onClose]);

  // Mount portal target and lock body scroll when open
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open, mounted]);

  const handleSelect = async (connector: Connector) => {
    try {
      await connect({ connector });
      // Modal will close automatically when wallet connects
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect wallet');
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

                     {/* Modal Card */}
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
             transition={{ type: 'spring', stiffness: 300, damping: 25 }}
             className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-[#1a1a1a] border border-[#D6E14E]/20 shadow-2xl p-6"
             style={{
               backgroundImage: `
                 linear-gradient(45deg, rgba(214, 225, 78, 0.05) 25%, transparent 25%, transparent 75%, rgba(214, 225, 78, 0.05) 75%),
                 linear-gradient(-45deg, rgba(214, 225, 78, 0.05) 25%, transparent 25%, transparent 75%, rgba(214, 225, 78, 0.05) 75%)
               `,
               backgroundSize: '20px 20px, 20px 20px',
               backgroundPosition: '0 0, 10px 10px'
             }}
           >
             <button
               className="absolute top-3 right-3 text-gray-400 hover:text-[#D6E14E] transition-colors duration-200"
               onClick={onClose}
               aria-label="Close modal"
             >
               <FaTimes />
             </button>
             <div className="text-center mb-6">
               <div className="flex justify-center mb-4">
                 <div className="w-16 h-16 bg-gradient-to-br from-[#D6E14E]/20 to-[#D6E14E]/10 rounded-full flex items-center justify-center border border-[#D6E14E]/30">
                   <FaWallet className="text-[#D6E14E] w-7 h-7" />
                 </div>
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">
                 Connect Wallet
               </h2>
               <p className="text-gray-400 text-sm">
                 Choose your preferred wallet to continue
               </p>
             </div>
             
                           <div className="flex flex-col gap-4">
                {filteredConnectors.map((connector: Connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleSelect(connector)}
                    disabled={isPending}
                    className="w-full px-6 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-[#D6E14E]/30 hover:border-[#D6E14E]/50 hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-800/80 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-[#D6E14E]/10"
                    style={{
                      boxShadow: '0 4px 20px rgba(214, 225, 78, 0.1)'
                    }}
                  >
                    <span className="text-lg">{connector.name}</span>
                    {isPending && (
                      <svg className="animate-spin h-5 w-5 text-[#D6E14E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
             
             <div className="mt-6 pt-4 border-t border-gray-700/50">
               <p className="text-xs text-gray-500 text-center">
                 By connecting your wallet, you agree to our Terms of Service and Privacy Policy
               </p>
             </div>
           </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 