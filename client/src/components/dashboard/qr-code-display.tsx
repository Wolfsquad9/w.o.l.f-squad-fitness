import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Share2, Scan, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type QRCodeDisplayProps = {
  userId?: number;
};

export default function QRCodeDisplay({ userId }: QRCodeDisplayProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  
  // Fetch user QR code
  const { data: qrData, isLoading } = useQuery({
    queryKey: ["/api/user/qrcode"],
    enabled: !!userId,
  });
  
  // Handle share button click
  const handleShare = async () => {
    if (!qrData?.qrCode) return;
    
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My W.O.L.F. Squad QR Code',
          text: 'Scan my QR code to connect with me on W.O.L.F. Squad!',
          // In a real app, this would be a URL to a sharable version of the QR code
          url: window.location.origin,
        });
        
        toast({
          title: "Shared successfully",
          description: "Your QR code has been shared.",
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        toast({
          title: "Sharing not supported",
          description: "Your browser doesn't support direct sharing. Try copying the URL instead.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Failed to share QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <CardContent className="p-6">
        <h3 className="font-montserrat font-bold text-lg mb-4 text-foreground">Your W.O.L.F QR Code</h3>
        
        <div className="bg-[#1A1A1A] rounded-lg p-6 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="w-48 h-48 bg-white" />
          ) : (
            <div className="w-48 h-48 bg-white p-2 rounded-lg flex items-center justify-center">
              {qrData?.qrCode ? (
                <QRCodeSVG 
                  value={qrData.qrCode}
                  size={176}
                  bgColor={"#FFFFFF"}
                  fgColor={"#1A1A1A"}
                  level={"H"}
                  includeMargin={false}
                />
              ) : (
                // Stylized QR code placeholder (matches the design)
                <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                  {/* Top left corner */}
                  <div className="col-span-3 row-span-3 bg-[#1A1A1A] rounded-tl-lg"></div>
                  <div className="col-span-2 row-span-1 bg-white"></div>
                  {/* Top right corner */}
                  <div className="col-span-3 row-span-3 bg-[#1A1A1A] rounded-tr-lg"></div>
                  
                  {/* Middle rows */}
                  <div className="col-span-1 row-span-2 bg-white"></div>
                  <div className="col-span-2 row-span-2 bg-[#1A1A1A] rounded"></div>
                  <div className="col-span-2 row-span-1 bg-white"></div>
                  <div className="col-span-1 row-span-2 bg-white"></div>
                  <div className="col-span-2 row-span-1 bg-[#1A1A1A]"></div>
                  <div className="col-span-2 row-span-1 bg-white"></div>
                  <div className="col-span-1 row-span-2 bg-white"></div>
                  
                  {/* Bottom left corner */}
                  <div className="col-span-3 row-span-3 bg-[#1A1A1A] rounded-bl-lg"></div>
                  <div className="col-span-2 row-span-2 bg-white"></div>
                  <div className="col-span-1 row-span-1 bg-[#1A1A1A]"></div>
                  <div className="col-span-2 row-span-2 bg-white"></div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                `WS-${userId || '0000000'}`
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Generated</span>
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                new Date().toLocaleDateString()
              )}
            </span>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center py-2 px-3 bg-primary/10 text-primary"
              onClick={handleShare}
              disabled={isSharing || isLoading}
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 mr-1" />
              )}
              Share
            </Button>
            <Button asChild className="flex items-center justify-center py-2 px-3">
              <a href="/scan">
                <Scan className="w-4 h-4 mr-1" />
                Scan Now
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
