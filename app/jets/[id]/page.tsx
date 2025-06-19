"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import jetData from '../../data/jets.json';
// import { PaystackButton } from 'react-paystack'
import emailjs from 'emailjs-com'

import dynamic from 'next/dynamic';
const PaystackButton = dynamic(() => import('react-paystack').then(mod => mod.PaystackButton), { ssr: false });


import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar 
} from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon,
  Check,
  ChevronLeft,
  Plane,
  Users,
  Briefcase,
  Globe,
  Clock,
  Gauge,
  Calendar as CalendarIcon2,
  MapPin,
  Shield
} from "lucide-react";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export default function JetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [jetDetails, setJetDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [passengers, setPassengers] = useState(1);
  //checkout
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // EmailJS configuration
const sendBookingConfirmation = (bookingData: any) => {
    const templateParams = {
      to_email: email,
      from_name: 'Your Jet Charter Service',
      user_name: name,
      jet_name: jetDetails.name,
      start_date: dateRange.from ? format(dateRange.from, "MMMM d, yyyy") : "",
      end_date: dateRange.to ? format(dateRange.to, "MMMM d, yyyy") : "",
      passengers: passengers,
      total_price: calculateTotalPrice().toLocaleString(),
      booking_reference: bookingData.reference,
    };
  
    // Send email to customer
    emailjs.send(
      'service_krza6gm',
      'template_mtzrtzd',
      templateParams,
      '4Y5VWlaquUmRnCgf8'
    )
    .then((response) => {
      console.log('Email sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
  
    // Send notification to yourself
    const adminTemplateParams = {
      to_email: 'jherieelegba@gmail.com', // Your email address
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      jet_name: jetDetails.name,
      start_date: dateRange.from ? format(dateRange.from, "MMMM d, yyyy") : "",
      end_date: dateRange.to ? format(dateRange.to, "MMMM d, yyyy") : "",
      passengers: passengers,
      total_price: calculateTotalPrice().toLocaleString(),
      booking_reference: bookingData.reference,
    };
  
    emailjs.send(
      'service_krza6gm',
      'template_hv8g5di',
      adminTemplateParams,
      '4Y5VWlaquUmRnCgf8'
    );
  };

  useEffect(() => {
    if (params.id) {
      const jetId = Array.isArray(params.id) ? params.id[0] : params.id;
      const jet = jetData.jets.find(jet => jet.id === jetId);
      
      if (jet) {
        setJetDetails(jet);
      } else {
        // Handle jet not found
        router.push('/jets');
      }
    }
    setIsLoading(false);
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!jetDetails) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Jet not found</h1>
          <p className="mt-4">Sorry, we couldn't find the jet you're looking for.</p>
          <Button asChild className="mt-8">
            <Link href="/jets">Return to Fleet</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * jetDetails.pricePerDay;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back to fleet link */}
      <Link href="/jets" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Fleet
      </Link>

      {/* Jet Title */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Badge className="mb-2">{jetDetails.category}</Badge>
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-foreground`}>
              {jetDetails.name}
            </h1>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-3xl font-bold text-primary">${jetDetails.pricePerDay.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">per day</div>
          </div>
        </div>
      </div>

      {/* Jet Images Carousel */}
      <div className="mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {jetDetails.images && jetDetails.images.map((image: string, index: number) => (
              <CarouselItem key={index}>
                <div className="relative h-[400px] md:h-[500px] w-full bg-gradient-to-r from-muted to-muted/60 rounded-lg overflow-hidden">
                  {/* Placeholder for image */}
                  <Image 
                    src={image} 
                    alt={`${jetDetails.name} - Image ${index + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Jet Details */}
        <div className="flex-1">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="floorplan">Floorplan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              {/* Description */}
              <div>
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Description</h2>
                <p className="text-muted-foreground">{jetDetails.description}</p>
              </div>
              
              {/* Key Features */}
              <div>
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jetDetails.features && jetDetails.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Highlights */}
              <div>
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Highlights</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 border-0">
                    <CardContent className="p-6">
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold text-lg">{jetDetails.capacity} Passengers</h3>
                      <p className="text-sm text-muted-foreground">Maximum capacity</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-0">
                    <CardContent className="p-6">
                      <Globe className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold text-lg">{jetDetails.rangeKm.toLocaleString()} km</h3>
                      <p className="text-sm text-muted-foreground">Maximum range</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-0">
                    <CardContent className="p-6">
                      <Gauge className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold text-lg">{jetDetails.cruiseSpeed} km/h</h3>
                      <p className="text-sm text-muted-foreground">Cruise speed</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-0">
                    <CardContent className="p-6">
                      <Clock className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold text-lg">{jetDetails.maxFlightHours} hours</h3>
                      <p className="text-sm text-muted-foreground">Max flight time</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-0">
                    <CardContent className="p-6">
                      <Briefcase className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold text-lg">{jetDetails.luggageCapacity} kg</h3>
                      <p className="text-sm text-muted-foreground">Luggage capacity</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-0">
                    <CardContent className="p-6">
                      <CalendarIcon2 className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold text-lg">{jetDetails.yearManufactured}</h3>
                      <p className="text-sm text-muted-foreground">Year manufactured</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
              <h2 className={`${playfair.className} text-2xl font-bold mb-6`}>Technical Specifications</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Manufacturer</TableCell>
                    <TableCell>{jetDetails.name.split(' ')[0]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Model</TableCell>
                    <TableCell>{jetDetails.name.split(' ').slice(1).join(' ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Year</TableCell>
                    <TableCell>{jetDetails.yearManufactured}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maximum Passengers</TableCell>
                    <TableCell>{jetDetails.capacity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maximum Range</TableCell>
                    <TableCell>{jetDetails.rangeKm.toLocaleString()} km</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cruise Speed</TableCell>
                    <TableCell>{jetDetails.cruiseSpeed} km/h</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maximum Flight Hours</TableCell>
                    <TableCell>{jetDetails.maxFlightHours} hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Luggage Capacity</TableCell>
                    <TableCell>{jetDetails.luggageCapacity} kg</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="floorplan">
              <h2 className={`${playfair.className} text-2xl font-bold mb-6`}>Cabin Floorplan</h2>
              <div className="relative h-[400px] md:h-[500px] w-full bg-muted rounded-lg overflow-hidden">
                {/* Placeholder for floorplan */}
                <Image 
                  src={jetDetails.floorplan} 
                  alt={`${jetDetails.name} - Floorplan`} 
                  fill 
                  className="object-contain" 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Booking Widget */}
        <div className="w-full lg:w-96">
          <div className="sticky top-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-primary/5 pb-4">
                <h2 className={`${playfair.className} text-2xl font-bold`}>Book This Jet</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Dates</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Select your dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                          numberOfMonths={2}
                          className="rounded-md"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Passengers</label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        disabled={passengers <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-4 font-medium w-8 text-center">{passengers}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPassengers(Math.min(jetDetails.capacity, passengers + 1))}
                        disabled={passengers >= jetDetails.capacity}
                      >
                        +
                      </Button>
                      <span className="ml-4 text-sm text-muted-foreground">
                        (max {jetDetails.capacity})
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Daily Rate</span>
                      <span className="font-medium">${jetDetails.pricePerDay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Duration</span>
                      <span className="font-medium">
                        {dateRange.from && dateRange.to
                          ? `${Math.ceil(
                              Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} days`
                          : "N/A"}
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-xl">
                        ${calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      *Price includes crew, maintenance and insurance. Fuel surcharges and airport fees may apply.
                    </p>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter className="p-6 pt-0">
                <Button className="w-full text-base py-6" size="lg" disabled={!dateRange.from || !dateRange.to}>
                  Request Booking
                </Button>
              </CardFooter> */}
              <CardFooter className="p-6 pt-0">
                {!dateRange.from || !dateRange.to ? (
                    <Button disabled className="w-full text-base py-6" size="lg">
                    Select Dates to Book
                    </Button>
                ) : (
                    <>
                    {/* Contact Information Form */}
                    <div className="space-y-4 w-full mb-6">
                        <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            className="w-full p-2 border rounded"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                        />
                        </div>
                    </div>
                    
                    {/* PaystackButton */}
                    <PaystackButton
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 px-4 rounded"
                        text={isProcessing ? "Processing..." : "Pay Now"}
                        email={email}
                        amount={calculateTotalPrice() * 100} // Amount in kobo
                        publicKey="pk_live_a6449f660fd8db7f0366f0438f50136f5c6a8fba"
                        reference={new Date().getTime().toString()}
                        metadata={{
                          name,
                          phone,
                          jet: jetDetails.name,
                          startDate: format(dateRange.from, "yyyy-MM-dd"),
                          endDate: format(dateRange.to, "yyyy-MM-dd"),
                          passengers: passengers,
                          custom_fields: [
                            {
                              display_name: "Jet Name",
                              variable_name: "jet_name",
                              value: jetDetails.name,
                            },
                            {
                              display_name: "Passenger Count",
                              variable_name: "passenger_count",
                              value: passengers,
                            },
                          ],
                        }}
                        onSuccess={(reference) => {
                        setIsProcessing(true);
                        


                        
                        // Create booking data
                        const bookingData = {
                            reference: reference.reference,
                            jetId: jetDetails.id,
                            jetName: jetDetails.name,
                            startDate: dateRange.from?.toISOString() || "",
                            endDate: dateRange.to?.toISOString() || "",
                            passengers: passengers,
                            totalPrice: calculateTotalPrice(),
                            email: email,
                            name: name,
                            phone: phone,
                            bookingDate: new Date().toISOString(),
                        };
                        
                        // Store booking in localStorage
                        const existingBookings = JSON.parse(localStorage.getItem('jetBookings') || '[]');
                        existingBookings.push(bookingData);
                        localStorage.setItem('jetBookings', JSON.stringify(existingBookings));
                        
                        // Send email confirmation
                        sendBookingConfirmation(bookingData);
                        
                        // Redirect to confirmation page
                        router.push(`/booking/confirmation?ref=${reference.reference}`);
                        }}
                        onClose={() => {
                        setIsProcessing(false);
                        console.log('Payment closed');
                        }}
                    />
                    </>
                )}
                </CardFooter>
            </Card>
            
            {/* Service Guarantees */}
            <Card className="mt-6 border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Our Service Guarantees</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span className="text-sm">Flexible cancellation options</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span className="text-sm">Fully certified operators and crew</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span className="text-sm">Comprehensive insurance coverage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Need Help */}
            <Card className="mt-6 border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Speak with our charter experts to customize your journey or answer any questions.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Related Jets */}
      <div className="mt-16">
        <h2 className={`${playfair.className} text-3xl font-bold mb-6`}>Similar Aircraft</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jetData.jets
            .filter(jet => jet.id !== jetDetails.id && jet.category === jetDetails.category)
            .slice(0, 3)
            .map((jet) => (
              <Link key={jet.id} href={`/jets/${jet.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full bg-muted">
                    {/* Placeholder for image */}
                    <Image 
                      src={jet.images[0]}
                      alt={jet.name} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge>{jet.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{jet.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{jet.capacity}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{jet.rangeKm.toLocaleString()} km</span>
                      </div>
                    </div>
                    <div className="mt-4 font-semibold text-primary">
                      ${jet.pricePerDay.toLocaleString()}/day
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}