import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type AppCardProps = {
  app: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
  };
  isConnected: boolean;
  isLoading: boolean;
  onToggleConnection: () => void;
};

export default function AppCard({ 
  app, 
  isConnected, 
  isLoading, 
  onToggleConnection 
}: AppCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 flex items-center">
      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
        {app.icon}
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-center">
          <h3 className="font-montserrat font-semibold text-foreground">{app.name}</h3>
          {isConnected && (
            <Badge variant="outline" className="ml-2 px-2 py-0.5 bg-success/10 text-success text-xs">
              Connected
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{app.description}</p>
      </div>
      <Button
        variant={isConnected ? "outline" : "default"}
        size="sm"
        onClick={onToggleConnection}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isConnected ? (
          "Disconnect"
        ) : (
          "Connect"
        )}
      </Button>
    </div>
  );
}
