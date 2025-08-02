import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Address",
      content: "1149 Davenport Rd, Toronto, ON 90210"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      content: "(555) 123-4567"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      content: "kowtattys@gmail.com"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Hours",
      content: "Tuesday - Saturday: 11AM - 8PM"
    }
  ];

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Request Sent",
      description: "We'll get back to you as soon as possible!",
    });
    reset();
  };

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Contact Us
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {info.icon}
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{info.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Special Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name">Name</label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register("name", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      {...register("email", { required: true })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject">Subject</label>
                  <Input
                    id="subject"
                    placeholder="Subject of your request"
                    {...register("subject", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Your special request details"
                    className="min-h-[150px]"
                    {...register("message", { required: true })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;