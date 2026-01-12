import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";
import { useSubmitContact } from "@/hooks/use-contact";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const mutation = useSubmitContact();
  
  const form = useForm<z.infer<typeof insertContactSchema>>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertContactSchema>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title="Get In Touch" subtitle="We're Here to Help" />

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Card */}
          <div className="bg-primary text-white rounded-3xl p-8 md:p-12 shadow-2xl h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-2xl font-display font-bold mb-8 relative z-10">Contact Information</h3>
            
            <div className="space-y-8 relative z-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Visit Us</h4>
                  <p className="text-white/80">Ha Ramavhoya<br />Next to Traffic Department</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Call Us</h4>
                  <p className="text-white/80 mb-1">Director Masakona: 069 504 5003</p>
                  <p className="text-white/80">Director Netshifhefhe: 060 924 4815</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email Us</h4>
                  <p className="text-white/80">info@allstarsacademy.co.za</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Operating Hours</h4>
                  <p className="text-white/80">Mon - Fri: 08:00 - 17:00</p>
                  <p className="text-white/80">Sat: 09:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-display font-bold text-primary mb-2">Send us a Message</h3>
            <p className="text-gray-500 mb-8">Have a question? Fill out the form below and we'll get back to you.</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I would like to enquire about..." 
                          className="min-h-[150px] bg-gray-50 border-gray-200 focus-visible:ring-primary resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="w-full h-12 text-lg font-bold bg-secondary text-primary hover:bg-secondary/90 shadow-lg"
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Placeholder Map */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-lg h-[400px] bg-gray-200 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors"></div>
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.262524458514!2d30.1416!3d-23.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA1JzAwLjAiUyAzMMKwMDgnMzAuMCJF!5e0!3m2!1sen!2sza!4v1620000000000!5m2!1sen!2sza" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
