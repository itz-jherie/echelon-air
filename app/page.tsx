"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import jetData from './data/jets.json';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Clock, 
  Star, 
  Shield,
  Plane,
  Globe,
  Briefcase,
  ArrowRight,
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import Footer  from '../components/Footer'
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';

interface Jet {
  id: string;
  name: string;
  category: string;
  description: string;
  capacity: number;
  pricePerDay: number;
  rangeKm: number;
  maxSpeedKmh: number;
  cruiseSpeed: number;
  maxFlightHours: number;
  luggageCapacity: number;
  yearManufactured: number;
  features: string[];
  images: string[];
  floorplan: string;
  specifications: {
    manufacturer: string;
    yearManufactured: number;
    length: string;
    wingspan: string;
    height: string;
    maxAltitude: string;
    cabinWidth: string;
    cabinHeight: string;
    cabinLength: string;
    baggageCapacity: string;
  };
  amenities: string[];
  isAvailable: boolean;
}
const currentYear = new Date().getFullYear();


export default function Home() {
  const [featuredJets, setFeaturedJets] = useState<Jet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const threeJsContainer = useRef<HTMLDivElement | null>(null);
  const AnimatedButton = motion(Button);
  
  // Testimonials data
  const testimonials = [
    {
      quote: "The level of service and attention to detail was impeccable. From the moment we booked until landing, every aspect exceeded our expectations. This is truly luxury redefined.",
      author: "Jonathan Reynolds",
      title: "CEO, Quantum Ventures"
    },
    {
      quote: "As someone who flies frequently for business, I can confidently say this service has transformed my travel experience. The time saved and comfort gained are invaluable.",
      author: "Elizabeth Chen",
      title: "Global Director, Apex Industries"
    },
    {
      quote: "Perfect for our executive team retreats. The privacy allowed us to conduct sensitive business discussions while traveling, and the amenities made it feel like a five-star hotel in the sky.",
      author: "Michael Davenport",
      title: "Chairman, Stellar Group"
    }
  ];

  useEffect(() => {
    // Initialize emailjs
    emailjs.init("service_krza6gm");
    
    // Load jet data
    import("./data/jets.json").then((module) => {
      const topJets = [...module.default.jets]      
        .sort((a, b) => b.pricePerDay - a.pricePerDay)
        .slice(0, 3);
      
      setFeaturedJets(topJets);
      setIsLoading(false);
    });

    // Handle scroll events for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initialize Three.js scene
    if (threeJsContainer.current) {
      initThreeJsScene();
    }
    
    // Testimonial rotation interval
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(testimonialInterval);
    };
  }, []);

  const initThreeJsScene = () => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    if (threeJsContainer.current) {
      // Clear the container before appending
      while (threeJsContainer.current.firstChild) {
        threeJsContainer.current.removeChild(threeJsContainer.current.firstChild);
      }
      threeJsContainer.current.appendChild(renderer.domElement);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add another light from below for better visibility
    const bottomLight = new THREE.DirectionalLight(0x9090ff, 0.3);
    bottomLight.position.set(0, -5, 0);
    scene.add(bottomLight);
    
    // Create stars/particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create an improved jet model with better geometry
    const jetGroup = new THREE.Group();
    
    // Jet body - made longer and more streamlined
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.7, 8, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5f5f5, 
      shininess: 100,
      specular: 0x111111
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2; // Rotate to be horizontal
    jetGroup.add(body);
    
    // Fuselage nose cone - add a cone to the front
    const noseGeometry = new THREE.ConeGeometry(0.5, 2, 32);
    const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
    nose.position.set(5, 0, 0);
    nose.rotation.z = -Math.PI / 2; // Point forward
    jetGroup.add(nose);
    
    // Wings - make them more aerodynamic
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(3, -0.5);
    wingShape.lineTo(2.5, -3);
    wingShape.lineTo(0, -1);
    wingShape.lineTo(0, 0);
    
    const wingExtrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 3
    };
    
    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
    const wingMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd0d0d0,
      shininess: 80
    });
    
    // Left wing
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0, 0);
    jetGroup.add(leftWing);
    
    // Right wing (mirror of left wing)
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0, 0, 0);
    rightWing.rotation.y = Math.PI; // Rotate 180 degrees
    jetGroup.add(rightWing);
    
    // Tail wing - vertical stabilizer
    const tailFinGeometry = new THREE.BoxGeometry(2, 1.5, 0.2);
    const tailFin = new THREE.Mesh(tailFinGeometry, wingMaterial);
    tailFin.position.set(-4, 0.7, 0);
    jetGroup.add(tailFin);
    
    // Horizontal stabilizers
    const hStabGeometry = new THREE.BoxGeometry(1.5, 0.15, 2);
    const hStab = new THREE.Mesh(hStabGeometry, wingMaterial);
    hStab.position.set(-4, 0, 0);
    jetGroup.add(hStab);
    
    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const cockpitMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222, 
      shininess: 150, 
      transparent: true, 
      opacity: 0.8 
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(2.5, 0.5, 0);
    cockpit.rotation.z = Math.PI / 2;
    jetGroup.add(cockpit);
    
    // Engines
    const engineGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 16);
    const engineMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333,
      shininess: 30
    });
    
    // Left engine
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(0, -0.8, -1.5);
    leftEngine.rotation.z = Math.PI / 2;
    jetGroup.add(leftEngine);
    
    // Right engine
    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.position.set(0, -0.8, 1.5);
    rightEngine.rotation.z = Math.PI / 2;
    jetGroup.add(rightEngine);
    
    // Add the jet to the scene
    jetGroup.position.set(0, 0, 0);
    jetGroup.rotation.y = Math.PI / 4; // Angle slightly to show more of the jet
    jetGroup.scale.set(0.5, 0.5, 0.5);
    scene.add(jetGroup);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particles
      particlesMesh.rotation.y += 0.0005;
      
      // Animate jet with more pronounced movements
      jetGroup.rotation.y = Math.PI / 4 + Math.sin(Date.now() * 0.0005) * 0.2;
      jetGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.08;
      jetGroup.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      
      // Add parallax effect based on scroll position
      if (scrollY) {
        jetGroup.position.x = scrollY * -0.002;
        particlesMesh.position.x = scrollY * -0.001;
      }
      
      // Render
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
  };

  return (
    <div className="relative">
      {/* Hero Section with Three.js */}
      <section className="relative h-screen overflow-hidden">
        {/* Three.js container */}
        <div 
          ref={threeJsContainer} 
          className="absolute inset-0 z-0"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-background z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className=" text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              <span className="block">Elevate Your</span>
              <span className="px-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Journey</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl sm:text-2xl text-white/80 mb-12 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Experience the ultimate in private aviation with our luxury jet charter service
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button asChild size="lg" className="px-8 bg-primary hover:bg-primary/90 transition-all duration-300">
              <Link href="/jets" className="flex items-center">
                Explore Our Fleet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 transition-all duration-300">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white/80 rounded-full mt-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Jets Carousel */}
      <section className="container mx-auto px-4 py-24" id="featured-jets">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground">Featured Aircraft</h2>
          <Link href="/jets" className="flex items-center text-primary hover:text-primary/80 font-medium group">
            <span>View All</span>
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {featuredJets.map((jet, index) => (
              <CarouselItem key={jet.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/jets/${jet.id}`}>
                    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="relative h-64 w-full bg-gradient-to-r from-muted to-muted/60 overflow-hidden">
                        <Image 
                          src={jet.images[0]} 
                          alt={jet.name} 
                          fill 
                          style={{objectFit: 'cover'}}
                          className="group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-black/50 hover:bg-black/70 backdrop-blur-sm">{jet.category}</Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <h3 className="text-2xl font-bold">{jet.name}</h3>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-muted-foreground line-clamp-2 mb-4">{jet.description}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{jet.capacity} Passengers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{jet.rangeKm.toLocaleString()} km range</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center border-t pt-4">
                        <span className="text-2xl font-bold text-primary">${jet.pricePerDay.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">per day</span>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 overflow-hidden" id="how-it-works">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">The Premier Experience</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover why discerning travelers choose our private jet charter service
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Clock className="h-6 w-6" />,
              title: "Time Efficiency",
              description: "Bypass crowded airports and long security lines. Board within minutes of arrival and depart on your schedule."
            },
            {
              icon: <Star className="h-6 w-6" />,
              title: "Unparalleled Luxury",
              description: "Premium amenities, gourmet catering, and personalized service tailored to exceed your expectations."
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Ultimate Privacy",
              description: "Conduct confidential meetings, enjoy family time, or simply relax in complete privacy during your journey."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-500 bg-gradient-to-b from-card to-muted/10 h-full">
                <CardHeader className="pb-2">
                  <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div 
          className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-12 text-secondary-foreground relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <Plane className="h-64 w-64" />
            </motion.div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
            
            <div className="relative h-32 sm:h-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <blockquote className="text-xl italic mb-8">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-secondary-foreground/20 mr-4"></div>
              <div className="text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="font-bold">{testimonials[currentTestimonial].author}</div>
                    <div className="text-secondary-foreground/80 text-sm">{testimonials[currentTestimonial].title}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? "bg-white w-4" : "bg-white/50"
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div 
          className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background element */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-64 h-64 rounded-full bg-accent/40 absolute -top-32 -left-32 blur-3xl"></div>
              <div className="w-64 h-64 rounded-full bg-primary/40 absolute -bottom-32 -right-32 blur-3xl"></div>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready For Takeoff?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the luxury and convenience of private aviation today
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatedButton 
                asChild 
                size="lg" 
                className="px-8 bg-primary hover:bg-primary/90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/jets" className="flex items-center">
                  Book Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </AnimatedButton>
            </motion.div>
          </div>
        </motion.div>
      </section>
     <section>
      <Footer/>
     </section>
    </div>
  );
}