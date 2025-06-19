"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import jetData from '../data/jets.json';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Globe, 
  Users, 
  Briefcase,
  ChevronDown,
  Search,
  X,
  Plane,
  Gauge,
  Clock
} from "lucide-react";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export default function JetsPage() {
  const [jets, setJets] = useState<typeof jetData.jets>([]);
  const [filteredJets, setFilteredJets] = useState<typeof jetData.jets>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minCapacity, setMinCapacity] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [minRange, setMinRange] = useState(0);
  const [sortBy, setSortBy] = useState('price-asc');
  
  // Get unique categories
  const categories = [...new Set(jetData.jets.map(jet => jet.category))];
  
  // Maximum values for sliders
  const maxCapacityValue = Math.max(...jetData.jets.map(jet => jet.capacity));
  const maxPriceValue = Math.max(...jetData.jets.map(jet => jet.pricePerDay));
  const maxRangeValue = Math.max(...jetData.jets.map(jet => jet.rangeKm));
  
  useEffect(() => {
    setJets(jetData.jets);
    setFilteredJets(jetData.jets);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = jets;
    
    // Search filter
    if (searchQuery) {
      result = result.filter(jet => 
        jet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        jet.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory) {
      result = result.filter(jet => jet.category === selectedCategory);
    }
    
    // Capacity filter
    if (minCapacity > 0) {
      result = result.filter(jet => jet.capacity >= minCapacity);
    }
    
    // Price filter
    if (maxPrice < maxPriceValue) {
      result = result.filter(jet => jet.pricePerDay <= maxPrice);
    }
    
    // Range filter
    if (minRange > 0) {
      result = result.filter(jet => jet.rangeKm >= minRange);
    }
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'capacity-asc':
        result = [...result].sort((a, b) => a.capacity - b.capacity);
        break;
      case 'capacity-desc':
        result = [...result].sort((a, b) => b.capacity - a.capacity);
        break;
      case 'range-asc':
        result = [...result].sort((a, b) => a.rangeKm - b.rangeKm);
        break;
      case 'range-desc':
        result = [...result].sort((a, b) => b.rangeKm - a.rangeKm);
        break;
      default:
        break;
    }
    
    setFilteredJets(result);
  }, [jets, searchQuery, selectedCategory, minCapacity, maxPrice, minRange, sortBy, maxPriceValue]);
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMinCapacity(0);
    setMaxPrice(maxPriceValue);
    setMinRange(0);
    setSortBy('price-asc');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-16 text-center">
        <h1 className={`${playfair.className} text-5xl font-bold text-foreground mb-4`}>
          Our Exclusive Fleet
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our curated collection of luxury aircraft, each offering unparalleled comfort and performance
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 mb-8">
          <div className="bg-card rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Capacity Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Min Capacity</label>
                <span className="text-sm text-muted-foreground">{minCapacity} passengers</span>
              </div>
              <Slider
                value={[minCapacity]}
                min={0}
                max={maxCapacityValue}
                step={1}
                onValueChange={(value) => setMinCapacity(value[0])}
              />
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Max Price</label>
                <span className="text-sm text-muted-foreground">${maxPrice.toLocaleString()}</span>
              </div>
              <Slider
                value={[maxPrice]}
                min={0}
                max={maxPriceValue}
                step={1000}
                onValueChange={(value) => setMaxPrice(value[0])}
              />
            </div>
            
            {/* Range Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Min Range</label>
                <span className="text-sm text-muted-foreground">{minRange.toLocaleString()} km</span>
              </div>
              <Slider
                value={[minRange]}
                min={0}
                max={maxRangeValue}
                step={500}
                onValueChange={(value) => setMinRange(value[0])}
              />
            </div>
            
            <Separator className="my-6" />
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="capacity-asc">Capacity: Low to High</SelectItem>
                  <SelectItem value="capacity-desc">Capacity: High to Low</SelectItem>
                  <SelectItem value="range-asc">Range: Low to High</SelectItem>
                  <SelectItem value="range-desc">Range: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Jets Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {filteredJets.length} {filteredJets.length === 1 ? 'Aircraft' : 'Aircraft'} Available
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="h-64 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredJets.length === 0 ? (
            <div className="text-center py-16">
              <Plane className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jets found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find the perfect aircraft</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJets.map((jet) => (
                <Link key={jet.id} href={`/jets/${jet.id}`} className="block">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-1/3 h-60 md:h-auto bg-gradient-to-r from-muted to-muted/60">
                        <Image src={jet.images[0]} alt={jet.name} fill style={{objectFit: 'cover'}} />
                        <div className="absolute top-4 left-4">
                          <Badge>{jet.category}</Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className={`${playfair.className} text-2xl font-bold`}>{jet.name}</h3>
                          <div className="flex items-center mt-2 md:mt-0">
                            <span className="text-2xl font-bold text-primary">${jet.pricePerDay.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground ml-1">per day</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-6 line-clamp-2">{jet.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{jet.capacity} Passengers</span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{jet.rangeKm.toLocaleString()} km range</span>
                          </div>
                          <div className="flex items-center">
                            <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{jet.cruiseSpeed} km/h</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{jet.maxFlightHours} hours max flight</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{jet.luggageCapacity} kg luggage</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end">
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}