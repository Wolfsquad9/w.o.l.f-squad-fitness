import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Utensils } from "lucide-react";
import { analyzeFoodImage } from "@/lib/anthropic-service";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type FoodAnalysisResult = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  recommendations: string[];
};

export function FoodAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (selectedFile) {
      // Vérifier que le fichier est une image
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const analyzeImage = async () => {
    if (!file) {
      toast({
        title: "Aucune image sélectionnée",
        description: "Veuillez sélectionner une image d'aliment à analyser",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const analysisResult = await analyzeFoodImage(file);
      setResult(analysisResult);
      
      toast({
        title: "Analyse complétée",
        description: "L'analyse de votre repas est prête",
      });
    } catch (error) {
      toast({
        title: "Erreur d'analyse",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'analyse de l'image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Analyseur de Repas IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!result ? (
            <>
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <Input
                  type="file"
                  className="hidden"
                  id="food-image"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <label htmlFor="food-image" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu du repas" 
                        className="max-h-64 mx-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour changer d'image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Télécharger une photo de repas</p>
                        <p className="text-sm text-muted-foreground">
                          Prenez une photo claire de votre repas pour l'analyse nutritionnelle
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <Button 
                className="w-full" 
                onClick={analyzeImage} 
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  "Analyser mon repas"
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Calories</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{result.calories}</span>
                    <span className="text-sm text-muted-foreground">kcal</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Protéines</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{result.protein}</span>
                    <span className="text-sm text-muted-foreground">g</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Glucides</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{result.carbs}</span>
                    <span className="text-sm text-muted-foreground">g</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Lipides</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{result.fat}</span>
                    <span className="text-sm text-muted-foreground">g</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Répartition macronutriments</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Protéines</span>
                    <span>{Math.round((result.protein * 4 / result.calories) * 100)}%</span>
                  </div>
                  <Progress value={(result.protein * 4 / result.calories) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Glucides</span>
                    <span>{Math.round((result.carbs * 4 / result.calories) * 100)}%</span>
                  </div>
                  <Progress value={(result.carbs * 4 / result.calories) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lipides</span>
                    <span>{Math.round((result.fat * 9 / result.calories) * 100)}%</span>
                  </div>
                  <Progress value={(result.fat * 9 / result.calories) * 100} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {result.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Recommandations</p>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                onClick={resetForm}
              >
                Analyser un autre repas
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}