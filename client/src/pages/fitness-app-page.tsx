import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function FitnessAppPage() {
  const { user } = useAuth();
  const [page, setPage] = useState("home");

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">W.O.L.F Squad Fitness</h1>
        <p className="text-muted-foreground">Bonjour, {user.fullName || user.username}</p>
      </header>

      <nav className="flex justify-around mb-6 bg-card rounded-lg p-2 shadow-md">
        <Button 
          variant={page === "home" ? "default" : "ghost"} 
          onClick={() => setPage("home")}
          className="flex-1 mx-1"
        >
          Accueil
        </Button>
        <Button 
          variant={page === "training" ? "default" : "ghost"} 
          onClick={() => setPage("training")}
          className="flex-1 mx-1"
        >
          Entraînements
        </Button>
        <Button 
          variant={page === "nutrition" ? "default" : "ghost"} 
          onClick={() => setPage("nutrition")}
          className="flex-1 mx-1"
        >
          Nutrition
        </Button>
        <Button 
          variant={page === "shop" ? "default" : "ghost"} 
          onClick={() => setPage("shop")}
          className="flex-1 mx-1"
        >
          Boutique
        </Button>
        <Button 
          variant={page === "profile" ? "default" : "ghost"} 
          onClick={() => setPage("profile")}
          className="flex-1 mx-1"
        >
          Profil
        </Button>
      </nav>

      <main className="mb-8">
        {page === "home" && <HomePage user={user} />}
        {page === "training" && <TrainingPage user={user} />}
        {page === "nutrition" && <NutritionPage />}
        {page === "shop" && <ShopPage />}
        {page === "profile" && <ProfilePage user={user} />}
      </main>
    </div>
  );
}

function HomePage({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <h1 className="text-xl font-bold mb-2">Bienvenue, {user.fullName || user.username} !</h1>
          <p className="text-muted-foreground">Niveau: {user.level} | Points: {user.points}</p>
          <div className="mt-4">
            <p>Choisissez une section pour commencer votre parcours santé.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-2">Objectifs récents</h2>
          <p className="text-sm text-muted-foreground mb-4">Suivez vos progrès quotidiens</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Entraînements hebdomadaires</span>
              <span className="font-medium">3/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Calories brûlées</span>
              <span className="font-medium">1250/2000</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Hydratation</span>
              <span className="font-medium">6/8 verres</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-2">Activité récente</h2>
          <p className="text-sm text-muted-foreground mb-4">Dernières sessions d'entraînement</p>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-3">
              <p className="font-medium">Course à pied</p>
              <p className="text-xs text-muted-foreground">Hier - 35 min, 4.5 km</p>
            </div>
            <div className="border-l-4 border-primary pl-3">
              <p className="font-medium">Musculation</p>
              <p className="text-xs text-muted-foreground">Il y a 2 jours - 45 min</p>
            </div>
            <div className="border-l-4 border-primary pl-3">
              <p className="font-medium">Yoga</p>
              <p className="text-xs text-muted-foreground">Il y a 3 jours - 30 min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrainingPage({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-2">Vos entraînements</h2>
          <p className="text-muted-foreground">Programmes personnalisés pour atteindre vos objectifs</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Programme recommandé</h3>
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">HIIT Cardio</h4>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">30 min</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Entraînement intense parfait pour brûler des calories et améliorer l'endurance.</p>
              <Button className="w-full mt-3" size="sm">Commencer</Button>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">Haut du corps</h4>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">45 min</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Cet entraînement se concentre sur les pectoraux, les épaules et les bras.</p>
              <Button className="w-full mt-3" size="sm">Commencer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Planification</h3>
          <div className="space-y-2">
            <div className="border-b pb-2">
              <p className="font-medium">Lundi</p>
              <p className="text-sm text-muted-foreground">HIIT Cardio - 30 min</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Mercredi</p>
              <p className="text-sm text-muted-foreground">Haut du corps - 45 min</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Vendredi</p>
              <p className="text-sm text-muted-foreground">Bas du corps - 45 min</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Dimanche</p>
              <p className="text-sm text-muted-foreground">Étirements & Récupération - 30 min</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">Modifier mon planning</Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodAnalyzer } from "@/components/nutrition/food-analyzer";

function NutritionPage() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-2">Suivi nutritionnel</h2>
          <p className="text-muted-foreground">Suivez vos apports et atteignez vos objectifs nutritionnels</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="journal" className="flex-1">Journal</TabsTrigger>
          <TabsTrigger value="analyzer" className="flex-1">Analyse IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Aujourd'hui</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted p-3 rounded-md text-center">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="text-lg font-bold">1450/2200</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <p className="text-xs text-muted-foreground">Eau</p>
                    <p className="text-lg font-bold">1.5/2.5 L</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <p className="text-xs text-muted-foreground">Protéines</p>
                    <p className="text-lg font-bold">85/120 g</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <p className="text-xs text-muted-foreground">Glucides</p>
                    <p className="text-lg font-bold">180/250 g</p>
                  </div>
                </div>
                <Button className="w-full" size="sm">Ajouter un repas</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Repas d'aujourd'hui</h3>
                <div className="space-y-3">
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Petit-déjeuner</p>
                      <p className="text-xs text-muted-foreground">420 kcal</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Avoine, fruits & yaourt grec</p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Déjeuner</p>
                      <p className="text-xs text-muted-foreground">650 kcal</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Poulet, riz brun & légumes</p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Collation</p>
                      <p className="text-xs text-muted-foreground">180 kcal</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Pomme & amandes</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">Voir mon journal nutritionnel</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analyzer">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-muted p-4 rounded-md mb-2">
              <p className="text-sm text-center">
                Notre analyseur d'image IA peut identifier les aliments et estimer leur valeur nutritionnelle. Prenez une photo claire de votre repas et laissez Claude faire le reste !
              </p>
            </div>
            <FoodAnalyzer />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ShopPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-2">Boutique</h2>
          <p className="text-muted-foreground">Explorez notre sélection d'articles de fitness</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Vêtements populaires</h3>
          <div className="space-y-4">
            <div className="border rounded-md p-3">
              <p className="font-medium">T-shirt d'entraînement W.O.L.F</p>
              <p className="text-sm text-muted-foreground mb-2">Performance respirante, Noir</p>
              <div className="flex justify-between items-center">
                <p className="font-bold">35 €</p>
                <Button size="sm">Voir</Button>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <p className="font-medium">Legging compression W.O.L.F</p>
              <p className="text-sm text-muted-foreground mb-2">Technologie anti-humidité, Gris</p>
              <div className="flex justify-between items-center">
                <p className="font-bold">45 €</p>
                <Button size="sm">Voir</Button>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <p className="font-medium">Veste légère W.O.L.F</p>
              <p className="text-sm text-muted-foreground mb-2">Coupe-vent & imperméable, Bleu</p>
              <div className="flex justify-between items-center">
                <p className="font-bold">65 €</p>
                <Button size="sm">Voir</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Marques partenaires</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-md p-3 text-center hover:border-primary cursor-pointer">
              <p className="font-bold">Adidas</p>
              <p className="text-xs text-muted-foreground">42 produits</p>
            </div>
            <div className="border rounded-md p-3 text-center hover:border-primary cursor-pointer">
              <p className="font-bold">Nike</p>
              <p className="text-xs text-muted-foreground">38 produits</p>
            </div>
            <div className="border rounded-md p-3 text-center hover:border-primary cursor-pointer">
              <p className="font-bold">Under Armour</p>
              <p className="text-xs text-muted-foreground">27 produits</p>
            </div>
            <div className="border rounded-md p-3 text-center hover:border-primary cursor-pointer">
              <p className="font-bold">Puma</p>
              <p className="text-xs text-muted-foreground">15 produits</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">Voir toutes les marques</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfilePage({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-2">Profil utilisateur</h2>
          <p className="text-muted-foreground">Personnalisez vos objectifs et vos préférences</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
              {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{user.fullName || user.username}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs">Membre depuis mars 2025</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Niveau</span>
              <span className="font-medium">{user.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Points</span>
              <span className="font-medium">{user.points}</span>
            </div>
            <div className="flex justify-between">
              <span>Entraînements</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span>Badges</span>
              <span className="font-medium">5</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" size="sm">Modifier le profil</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Objectifs personnels</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Perdre du poids</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Améliorer l'endurance</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Augmenter la masse musculaire</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4" size="sm">Mettre à jour mes objectifs</Button>
        </CardContent>
      </Card>
    </div>
  );
}