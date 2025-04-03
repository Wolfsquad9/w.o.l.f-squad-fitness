import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LiveWorkoutTracker from "@/components/workout/live-workout-tracker";

export default function WorkoutTrackerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Track Your Workout</h1>
          <LiveWorkoutTracker />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}