"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-block bg-emerald-100 p-2 rounded-full mb-4">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-tight">
            Dive into the World of Anonymous Conversation
          </h1>

          <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore Mystery Message — Where your identity remains secret and
            your thoughts flow freely
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all duration-300"
              size="lg"
            >
              <Link href="/dashboard" className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Anonymity</h3>
              <p className="text-gray-600">
                Your identity is protected, allowing for honest expression.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Meaningful Connections
              </h3>
              <p className="text-gray-600">
                Connect with others based on thoughts, not appearances.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safe Environment</h3>
              <p className="text-gray-600">
                Our platform prioritizes your privacy and security.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="w-full max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            What People Are Saying
          </h2>

          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-md mx-auto"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardHeader className="font-semibold text-lg text-emerald-700 pb-2">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-6 text-gray-700">
                        <span className="text-lg italic">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="relative  transform-none bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" />
              <CarouselNext className="relative  transform-none bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" />
            </div>
          </Carousel>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MessageSquare className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="font-semibold text-gray-800">Mystery Message</span>
          </div>

          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Mystery Message. All rights reserved.
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
