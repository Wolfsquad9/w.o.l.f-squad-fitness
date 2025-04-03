import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
              </svg>
              <span className="font-montserrat font-bold text-2xl tracking-tight">W.O.L.F SQUAD</span>
            </div>
            <p className="text-white/70 text-sm mb-4 max-w-xs">
              Elevate your fitness journey with technology-integrated apparel that tracks your progress and connects you with the pack.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.481C19.137 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z"></path>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-montserrat font-semibold mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">All Products</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">New Arrivals</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Women's</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Men's</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Accessories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-montserrat font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/community">
                    <a className="text-white/70 hover:text-white text-sm transition-colors">Find Your Pack</a>
                  </Link>
                </li>
                <li>
                  <Link href="/challenges">
                    <a className="text-white/70 hover:text-white text-sm transition-colors">Challenges</a>
                  </Link>
                </li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Events</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Ambassadors</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-montserrat font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Shipping</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Returns</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Size Guide</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-montserrat font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Sustainability</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Press</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} W.O.L.F Squad. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
