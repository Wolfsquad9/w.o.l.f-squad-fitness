import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQrScanner } from "@/hooks/use-qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Loader2, 
  ScrollText, 
  User,
  Upload
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ScanPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("camera");
  const { 
    isScanning, 
    scanResult, 
    error, 
    startScanning, 
    stopScanning, 
    handleScan, 
    resetScan 
  } = useQrScanner();
  const [showResultDialog, setShowResultDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerIntervalRef = useRef<number | null>(null);
  
  // Mock QR code for demo purposes
  const [mockQrCode, setMockQrCode] = useState<string | null>(null);
  
  // Handle camera scanning
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      try {
        if (isScanning && activeTab === "camera") {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        stopScanning();
      }
    };
    
    setupCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (scannerIntervalRef.current) {
        window.clearInterval(scannerIntervalRef.current);
        scannerIntervalRef.current = null;
      }
    };
  }, [isScanning, activeTab, stopScanning]);
  
  // Handle successful scan
  useEffect(() => {
    if (scanResult) {
      setShowResultDialog(true);
      stopScanning();
    }
  }, [scanResult, stopScanning]);
  
  // Start scanning
  const onStartScan = () => {
    resetScan();
    startScanning();
    
    // In a real app, this would use a QR code scanning library
    // For demo purposes, we'll simulate a scan after 3 seconds
    scannerIntervalRef.current = window.setTimeout(() => {
      if (mockQrCode) {
        handleScan(mockQrCode);
      }
    }, 3000);
  };
  
  // Handle file upload (for demo purposes)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Generate a mock QR code from the file name
    const mockQr = `apparel-${Date.now()}-demo`;
    setMockQrCode(mockQr);
    
    // Start the scanning process
    resetScan();
    startScanning();
    
    // Simulate processing the uploaded image
    setTimeout(() => {
      handleScan(mockQr);
    }, 1500);
  };
  
  // Select a demo QR code
  const selectDemoQrCode = (type: 'apparel' | 'user') => {
    const mockQr = type === 'apparel' 
      ? `apparel-${Date.now()}-demo`
      : `user-${Date.now()}-demo`;
    
    setMockQrCode(mockQr);
  };
  
  // Close the result dialog
  const closeResultDialog = () => {
    setShowResultDialog(false);
    resetScan();
  };
  
  // Handle tracking a workout with scanned apparel
  const trackWorkout = () => {
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">QR Scanner</h1>
          <p className="text-muted-foreground">Scan your W.O.L.F. Squad QR codes to track workouts and connect with the pack.</p>
        </div>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>For Demonstration Purposes</AlertTitle>
          <AlertDescription>
            This is a simulated QR scanner. In a production environment, it would use a real QR code scanning library.
            For now, select a demo QR code type below, then click "Start Scanning" to simulate a scan.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>W.O.L.F. Squad QR Scanner</CardTitle>
                <CardDescription>
                  Scan QR codes from your W.O.L.F. Squad apparel or other members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="camera">Camera Scanner</TabsTrigger>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="camera">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-full max-w-xl aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {isScanning ? (
                          <>
                            <video 
                              ref={videoRef} 
                              className="absolute inset-0 w-full h-full object-cover"
                              autoPlay 
                              playsInline
                            />
                            <div className="absolute inset-0 border-[3px] border-primary/40 rounded-lg" />
                            <div className="absolute inset-20 border-2 border-primary rounded-lg" />
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Camera preview will appear here</p>
                          </div>
                        )}
                        
                        {isScanning && (
                          <div className="absolute top-0 left-0 right-0 bg-primary/80 text-white p-2 text-center text-sm">
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Scanning for QR codes...
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col w-full max-w-xl space-y-4">
                        <div className="flex gap-4">
                          <Button 
                            className="flex-1"
                            onClick={() => selectDemoQrCode('apparel')}
                            variant={mockQrCode?.includes('apparel') ? "default" : "outline"}
                          >
                            Demo Apparel QR
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => selectDemoQrCode('user')}
                            variant={mockQrCode?.includes('user') ? "default" : "outline"}
                          >
                            Demo User QR
                          </Button>
                        </div>
                        
                        {isScanning ? (
                          <Button 
                            variant="destructive" 
                            onClick={stopScanning}
                          >
                            Cancel Scan
                          </Button>
                        ) : (
                          <Button 
                            onClick={onStartScan}
                            disabled={!mockQrCode}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Start Scanning
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 w-full max-w-xl flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Upload QR Code Image</h3>
                        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                          Take a photo of a W.O.L.F. Squad QR code and upload it here to process
                        </p>
                        
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                          <div className="flex gap-4">
                            <Button 
                              className="flex-1"
                              onClick={() => selectDemoQrCode('apparel')}
                              variant={mockQrCode?.includes('apparel') ? "default" : "outline"}
                            >
                              Demo Apparel QR
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={() => selectDemoQrCode('user')}
                              variant={mockQrCode?.includes('user') ? "default" : "outline"}
                            >
                              Demo User QR
                            </Button>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="file"
                              id="qr-upload"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleFileUpload}
                            />
                            <Button className="w-full" variant="outline">
                              Select Image File
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {isScanning && (
                        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Processing image...</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Need help? Check out our <a href="#" className="text-primary underline">scanning guide</a>.
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How to Use the QR Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Camera className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Scan Your Apparel</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan the QR code on your W.O.L.F. Squad apparel to track your workout
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Scan Other Members</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan another member's QR code to connect and view their profile
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Flame className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Track Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Each scan adds to your progress and can unlock achievements
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Your last 3 QR code scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <ScrollText className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">Performance Hoodie</div>
                      <div className="text-xs text-muted-foreground">Scanned today at 10:24 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="h-10 w-10 rounded-md bg-accent/10 flex items-center justify-center text-accent mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">James Wilson</div>
                      <div className="text-xs text-muted-foreground">Scanned yesterday at 3:15 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <ScrollText className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">Training Shirt</div>
                      <div className="text-xs text-muted-foreground">Scanned 2 days ago at 7:45 AM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scan Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Quick Tracking</h4>
                      <p className="text-sm text-muted-foreground">Log workouts in seconds by scanning your apparel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Accuracy</h4>
                      <p className="text-sm text-muted-foreground">Ensure your workouts are accurately tracked with each piece of apparel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Social Connection</h4>
                      <p className="text-sm text-muted-foreground">Connect with other members by scanning their personal QR codes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Scan Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Successful</DialogTitle>
            <DialogDescription>
              {scanResult?.type === 'apparel' 
                ? "You've scanned a W.O.L.F. Squad apparel item." 
                : "You've scanned a W.O.L.F. Squad member QR code."}
            </DialogDescription>
          </DialogHeader>
          
          {scanResult?.type === 'apparel' ? (
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <ScrollText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Performance Hoodie</h3>
                  <p className="text-sm text-muted-foreground">Added on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Track a workout with this item?</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={closeResultDialog}>
                    Not Now
                  </Button>
                  <Button onClick={trackWorkout}>
                    Track Workout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary">JW</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">James Wilson</h3>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-accent/10 text-accent">
                      Alpha
                    </Badge>
                    <span className="text-sm text-muted-foreground">Level 8</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex space-x-4 text-center">
                <div className="flex-1">
                  <p className="text-2xl font-bold">328</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <Separator orientation="vertical" />
                <div className="flex-1">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Workouts</p>
                </div>
                <Separator orientation="vertical" />
                <div className="flex-1">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            {scanResult?.type === 'user' && (
              <div className="w-full grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={closeResultDialog}>
                  Close
                </Button>
                <Button onClick={closeResultDialog}>
                  View Profile
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
