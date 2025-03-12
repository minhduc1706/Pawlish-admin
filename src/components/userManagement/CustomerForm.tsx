"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

// Customer type definition
interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  lastPurchase: string;
  totalSpent: number;
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  status: z.enum(["active", "inactive"]),
  lastPurchase: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please use YYYY-MM-DD format.",
  }),
  totalSpent: z.coerce.number().min(0, {
    message: "Total spent must be a positive number.",
  }),
});

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (data: Customer | Omit<Customer, "id">) => void;
  onCancel: () => void;
}

export default function CustomerForm({
  customer,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: customer
      ? { ...customer }
      : {
          name: "",
          email: "",
          status: "active",
          lastPurchase: new Date().toISOString().split("T")[0],
          totalSpent: 0,
        },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (customer) {
      onSubmit({ ...values, id: customer.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{customer ? "Edit Customer" : "Add New Customer"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastPurchase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalSpent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Spent</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
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
              {customer ? "Update Customer" : "Add Customer"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
