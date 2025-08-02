import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ArrowLeft, ArrowRight, Upload, Camera, Calendar, User, AlertCircle, Mail, Phone } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FlashDesign } from "@/lib/types";

interface CustomTattooFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomTattooFormData) => void;
  onBack: () => void;
  flashDesign?: FlashDesign | null;
  startAtStep?: number;
}

// Define the form schema for all steps
const customTattooFormSchema = z.object({
  // Step 1: Tattoo Idea
  tattooIdea: z.string().max(250, "Please keep your description under 250 characters"),
  
  // Step 2-3: Reference Images
  referenceImages: z.array(z.instanceof(File)).min(1, "Please upload at least one reference image"),
  
  // Step 4: Tattoo Size
  tattooSize: z.enum(["1-2 inches", "3-5 inches", "6-9 inches", "9+ inches", "Other"]),
  
  // Step 5: Tattoo Placement
  tattooPlacement: z.enum(["Back", "Shoulder", "Legs", "Chest", "Abdomen", "Hands", "Arms", "Feet", "Neck", "Other"]),
  
  // Step 6: Availability
  availability: z.array(z.string()).min(1, "Please select at least one day you're available"),
  
  // Step 7: Pronouns and Age
  pronouns: z.string().min(1, "Please enter your pronouns"),
  isOver18: z.boolean().refine(val => val === true, {
    message: "You must be 18 or older to book a tattoo appointment"
  }),
  
  // Step 8: Allergies
  allergies: z.string().max(250, "Please keep your allergies description under 250 characters"),
  
  // Step 9: Contact Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type CustomTattooFormData = z.infer<typeof customTattooFormSchema>;

export const CustomTattooForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onBack, 
  flashDesign = null,
  startAtStep = 1 
}: CustomTattooFormProps) => {
  const [step, setStep] = useState(startAtStep);
  const totalSteps = 9;
  
  // Add debugging
  useEffect(() => {
    console.log("CustomTattooForm isOpen:", isOpen);
    console.log("Flash design:", flashDesign);
    
    // Reset step when form is opened
    if (isOpen) {
      setStep(startAtStep);
    }
  }, [isOpen, startAtStep, flashDesign]);
  
  const form = useForm<CustomTattooFormData>({
    resolver: zodResolver(customTattooFormSchema),
    defaultValues: {
      tattooIdea: flashDesign ? `Flash design: ${flashDesign.title}` : "",
      referenceImages: [],
      tattooSize: undefined,
      tattooPlacement: undefined,
      availability: [],
      pronouns: "",
      isOver18: false,
      allergies: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    mode: "onChange"
  });
  
  // Update form values when flash design changes
  useEffect(() => {
    if (flashDesign) {
      form.setValue("tattooIdea", `Flash design: ${flashDesign.title}`);
      
      // If we had the image as a File object, we could set it here
      // For now, we'll just note that we're using a flash design
    }
  }, [flashDesign, form]);
  
  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    if (step === startAtStep) {
      onBack();
    } else {
      setStep(prev => Math.max(prev - 1, startAtStep));
    }
  };
  
  const handleSubmit = (data: CustomTattooFormData) => {
    // Add flash design info to the submission if available
    const submissionData = {
      ...data,
      flashDesign: flashDesign ? {
        id: flashDesign.id,
        title: flashDesign.title,
        price: flashDesign.price
      } : undefined
    };
    
    onSubmit(submissionData as CustomTattooFormData);
  };
  
  const weekdays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  
  // Function to check if the current step is valid
  const isCurrentStepValid = () => {
    switch (step) {
      case 1:
        return form.getValues().tattooIdea.length > 0 && form.getValues().tattooIdea.length <= 250;
      case 2:
      case 3:
        return form.getValues().referenceImages.length > 0;
      case 4:
        return !!form.getValues().tattooSize;
      case 5:
        return !!form.getValues().tattooPlacement;
      case 6:
        return form.getValues().availability.length > 0;
      case 7:
        return form.getValues().pronouns.length > 0 && form.getValues().isOver18;
      case 8:
        return form.getValues().allergies.length <= 250;
      case 9:
        return (
          form.getValues().firstName.length > 0 &&
          form.getValues().lastName.length > 0 &&
          form.getValues().email.length > 0 &&
          form.getValues().phone.length >= 10
        );
      default:
        return false;
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-5xl h-[90vh]"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="overflow-hidden shadow-xl h-full flex flex-col text-lg">
              <CardHeader className="relative p-6 pb-3 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-6 top-6"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </Button>
                <CardTitle className="text-3xl font-bold">
                  {flashDesign ? `Book "${flashDesign.title}"` : "Custom Tattoo Request"}
                </CardTitle>
                <CardDescription className="text-2xl mt-2">
                  Step {step} of {totalSteps}
                </CardDescription>
                <Progress value={(step / totalSteps) * 100} className="mt-4 h-3" />
              </CardHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-grow overflow-hidden">
                  <CardContent className="p-8 pt-4 overflow-y-auto flex-grow">
                    {/* Step 1: Tattoo Idea */}
                    {step === 1 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">Tell me more about your idea</h3>
                        <FormField
                          control={form.control}
                          name="tattooIdea"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-lg">Describe your tattoo idea</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="I'm thinking of a minimalist design with..." 
                                  className="min-h-[200px] text-xl"
                                  maxLength={250}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xl">
                                {field.value.length}/250 characters
                              </FormDescription>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    
                    {/* Step 2: First Reference Image */}
                    {step === 2 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">Upload a reference image</h3>
                        <FormField
                          control={form.control}
                          name="referenceImages"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-lg">Reference Image (Required)</FormLabel>
                              <FormControl>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                                  <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-md text-muted-foreground mb-4">
                                    Drag & drop or click to upload
                                  </p>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="max-w-xs text-lg"
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      if (files && files.length > 0) {
                                        const newImages = [...field.value];
                                        newImages.push(files[0]);
                                        field.onChange(newImages);
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-lg">
                                Upload an image that represents your tattoo idea
                              </FormDescription>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                        {form.getValues().referenceImages.length > 0 && (
                          <div className="mt-4">
                            <p className="text-md font-medium mb-2">Uploaded Images:</p>
                            <div className="flex flex-wrap gap-2">
                              {form.getValues().referenceImages.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Reference ${index + 1}`}
                                    className="h-20 w-20 object-cover rounded-md"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={() => {
                                      const newImages = [...form.getValues().referenceImages];
                                      newImages.splice(index, 1);
                                      form.setValue("referenceImages", newImages);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Step 3: Additional Reference Image (Optional) */}
                    {step === 3 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">Upload additional reference images (Optional)</h3>
                        <FormField
                          control={form.control}
                          name="referenceImages"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-lg">Additional Reference Images</FormLabel>
                              <FormControl>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-md text-muted-foreground mb-4">
                                    Drag & drop or click to upload more images
                                  </p>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="max-w-xs text-lg"
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      if (files && files.length > 0) {
                                        const newImages = [...field.value];
                                        newImages.push(files[0]);
                                        field.onChange(newImages);
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-lg">
                                You can upload more reference images to help us understand your vision better
                              </FormDescription>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                        {form.getValues().referenceImages.length > 0 && (
                          <div className="mt-4">
                            <p className="text-md font-medium mb-2">Uploaded Images:</p>
                            <div className="flex flex-wrap gap-2">
                              {form.getValues().referenceImages.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Reference ${index + 1}`}
                                    className="h-20 w-20 object-cover rounded-md"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={() => {
                                      const newImages = [...form.getValues().referenceImages];
                                      newImages.splice(index, 1);
                                      form.setValue("referenceImages", newImages);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Step 4: Tattoo Size */}
                    {step === 4 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">What size tattoo are you thinking?</h3>
                        <FormField
                          control={form.control}
                          name="tattooSize"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-3"
                                >
                                  {["1-2 inches", "3-5 inches", "6-9 inches", "9+ inches", "Other"].map((size) => (
                                    <div key={size} className="flex items-center space-x-2">
                                      <RadioGroupItem value={size} id={`size-${size}`} />
                                      <Label htmlFor={`size-${size}`} className="text-lg">{size}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    
                    {/* Step 5: Tattoo Placement */}
                    {step === 5 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">Where would you like your tattoo?</h3>
                        <FormField
                          control={form.control}
                          name="tattooPlacement"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="grid grid-cols-2 gap-2"
                                >
                                  {["Back", "Shoulder", "Legs", "Chest", "Abdomen", "Hands", "Arms", "Feet", "Neck", "Other"].map((placement) => (
                                    <div key={placement} className="flex items-center space-x-2">
                                      <RadioGroupItem value={placement} id={`placement-${placement}`} />
                                      <Label htmlFor={`placement-${placement}`} className="text-lg">{placement}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    
                    {/* Step 6: Availability */}
                    {step === 6 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">What days are you available?</h3>
                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <div className="mb-4">
                                <FormLabel className="text-lg">Select all days that work for you</FormLabel>
                                <FormDescription className="text-lg">
                                  We'll try to schedule your appointment on one of these days
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {weekdays.map((day) => (
                                  <FormItem
                                    key={day}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day)}
                                        onCheckedChange={(checked) => {
                                          const updatedDays = checked
                                            ? [...field.value, day]
                                            : field.value?.filter((d) => d !== day);
                                          field.onChange(updatedDays);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-lg">
                                      {day}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </div>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    
                    {/* Step 7: Pronouns and Age */}
                    {step === 7 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">About You</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="pronouns"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-lg">Your Pronouns</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., she/her, he/him, they/them" className="text-xl" {...field} />
                                </FormControl>
                                <FormMessage className="text-base" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isOver18"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-lg">
                                    I confirm that I am 18 years of age or older
                                  </FormLabel>
                                  <FormDescription className="text-lg">
                                    You must be at least 18 years old to get a tattoo
                                  </FormDescription>
                                </div>
                                <FormMessage className="text-base" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 8: Allergies */}
                    {step === 8 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">Do you have any allergies we should know about?</h3>
                        <FormField
                          control={form.control}
                          name="allergies"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-lg">Allergies</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="List any allergies or leave blank if none" 
                                  className="min-h-[200px] text-xl"
                                  maxLength={250}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xl">
                                {field.value.length}/250 characters
                              </FormDescription>
                              <FormMessage className="text-base" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    
                    {/* Step 9: Contact Information */}
                    {step === 9 && (
                      <motion.div>
                        <h3 className="text-2xl font-semibold mb-6">Your Contact Information</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-lg">First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your first name" className="text-xl" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-base" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-lg">Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your last name" className="text-xl" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-base" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-lg">Email Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="your.email@example.com" 
                                    className="text-xl"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-base" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-lg">Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="Enter your phone number" 
                                    className="text-xl"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-base" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t p-6 flex-shrink-0 bg-background sticky bottom-0">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      size="lg"
                      className="text-lg px-6 py-3"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      {step === startAtStep ? "Back to Designs" : "Previous"}
                    </Button>
                    
                    {step < totalSteps ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={!isCurrentStepValid()}
                        size="lg"
                        className="text-lg px-6 py-3"
                      >
                        Next
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit"
                        disabled={!isCurrentStepValid()}
                        size="lg"
                        className="text-lg px-6 py-3"
                      >
                        Submit Request
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 