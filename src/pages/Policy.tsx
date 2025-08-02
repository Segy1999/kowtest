import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Policy = () => {
  const policies = [
    {
      title: "Booking & Deposits",
      content: "A non-refundable deposit is required to secure your appointment. This will be deducted from the final price of your tattoo."
    },
    {
      title: "Age Requirement",
      content: "You must be 18 or older with valid ID to get tattooed. No exceptions."
    },
    {
      title: "Health & Safety",
      content: "We maintain strict sterilization procedures and use only single-use needles. Please inform us of any medical conditions."
    },
    {
      title: "Cancellations",
      content: "Please provide at least 48 hours notice for cancellations. Deposits may be forfeited for late cancellations."
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Studio Policy
        </motion.h1>
        
        <div className="grid gap-6 max-w-3xl mx-auto">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{policy.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Policy;