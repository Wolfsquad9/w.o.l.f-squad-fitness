import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type ScanResult = {
  type: 'user' | 'apparel';
  data: any;
};

export function useQrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const handleScan = useCallback(async (qrCode: string) => {
    if (!qrCode) return;
    
    setIsScanning(false);
    
    try {
      const response = await apiRequest('POST', '/api/scan', { qrCode });
      const result = await response.json();
      
      setScanResult(result);
      
      toast({
        title: 'QR Code Scanned Successfully',
        description: `Detected a ${result.type} QR code.`,
      });
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process QR code';
      setError(errorMsg);
      
      toast({
        title: 'Scan Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      
      return null;
    }
  }, [toast]);

  const resetScan = useCallback(() => {
    setScanResult(null);
    setError(null);
  }, []);

  return {
    isScanning,
    scanResult,
    error,
    startScanning,
    stopScanning,
    handleScan,
    resetScan
  };
}
