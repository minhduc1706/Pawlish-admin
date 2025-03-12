"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Scissors, Sparkles, Clock, DollarSign } from "lucide-react";

// Service type definition
interface Service {
  id: string;
  name: string;
  description: string;
  category: "spa" | "grooming";
  duration: number; // in minutes
  price: number;
  popularityScore: number; // 1-5
  forPetTypes: string[]; // e.g., ["dog", "cat"]
  image?: string;
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.enum(["spa", "grooming"]),
  duration: z.coerce.number().min(5, {
    message: "Duration must be at least 5 minutes.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  popularityScore: z.coerce.number().min(1).max(5),
  forPetTypes: z.array(z.string()).min(1, {
    message: "Select at least one pet type.",
  }),
});

const petTypes = [
  { id: "dog", label: "Dog" },
  { id: "cat", label: "Cat" },
  { id: "bird", label: "Bird" },
  { id: "small_animal", label: "Small Animal" },
];

interface ServiceFormProps {
  service: Service | null;
  onSubmit: (data: Service | Omit<Service, "id">) => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: service
      ? { ...service }
      : {
          name: "",
          description: "",
          category: "grooming",
          duration: 30,
          price: 29.99,
          popularityScore: 3,
          forPetTypes: ["dog"],
        },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (service) {
      onSubmit({ ...values, id: service.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {service?.category === "spa" ||
          (!service && form.watch("category") === "spa") ? (
            <Sparkles className="h-5 w-5 text-primary" />
          ) : (
            <Scissors className="h-5 w-5 text-primary" />
          )}
          {service ? "Edit Service" : "Add New Service"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Premium Pet Grooming" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="spa">
                          <div className="flex items-center">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Spa
                          </div>
                        </SelectItem>
                        <SelectItem value="grooming">
                          <div className="flex items-center">
                            <Scissors className="mr-2 h-4 w-4" />
                            Grooming
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service in detail..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <div className="flex-1">
                          <Input type="number" min={5} step={5} {...field} />
                        </div>
                      </FormControl>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {field.value >= 60
                          ? `${Math.floor(field.value / 60)}h ${
                              field.value % 60
                            }m`
                          : `${field.value}m`}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="29.99"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="popularityScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Popularity Score</FormLabel>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span
                          key={value}
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            value <= field.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FormDescription>
                    How popular is this service among your customers?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="forPetTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>For Pet Types</FormLabel>
                    <FormDescription>
                      Select which types of pets this service is available for.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {petTypes.map((petType) => (
                      <FormField
                        key={petType.id}
                        control={form.control}
                        name="forPetTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={petType.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(petType.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          petType.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== petType.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {petType.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {service ? "Update Service" : "Add Service"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
