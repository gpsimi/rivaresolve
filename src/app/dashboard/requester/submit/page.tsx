"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, X, AlertCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

const submitRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title is too long"),
  categoryId: z.string().min(1, "Please select an issue category"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
});

type SubmitRequestFormValues = z.infer<typeof submitRequestSchema>;

export default function SubmitRequestPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<SubmitRequestFormValues>({
    resolver: zodResolver(submitRequestSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
    },
  });

  // 1. Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to load request categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Could not fetch categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed as evidence");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // 3. Handle Form Submit
  const onSubmit = async (values: SubmitRequestFormValues) => {
    setError(null);
    setSuccess(null);
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("categoryId", values.categoryId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setSuccess("Complaint logged successfully! Redirecting to tracker...");
      form.reset();
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        router.push("/dashboard/requester/requests");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
          Report a Fault
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Submit details of maintenance issues or complaints. Upload images for clear evidence.
        </p>
      </div>

      <Card className="border-slate-200/80 shadow-md dark:border-slate-850">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 border border-green-100 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400">
                  {success}
                </div>
              )}

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Issue Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., Leaking pipe in Hostel Block B, Room 102"
                        disabled={submitLoading}
                        className="w-full border-slate-200 dark:border-slate-750"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category selection */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Category
                    </FormLabel>
                    <FormControl>
                      {categoriesLoading ? (
                        <div className="text-xs text-slate-400 dark:text-slate-500 animate-pulse">
                          Loading categories from database...
                        </div>
                      ) : (
                        <select
                          disabled={submitLoading}
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-200"
                          {...field}
                        >
                          <option value="" className="text-slate-400 dark:bg-slate-900">
                            -- Select Issue Category --
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Description of the Fault
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the issue in detail. State exact location, severity, and any hazards if applicable."
                        rows={4}
                        disabled={submitLoading}
                        className="w-full border-slate-200 dark:border-slate-750 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo upload section */}
              <div className="space-y-2">
                <label className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  Photo Evidence (Optional, max 5MB)
                </label>

                {!imagePreview ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={submitLoading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <Upload size={32} className="text-slate-400 group-hover:text-slate-500 mb-2" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Click to select an image
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      PNG, JPG, or WEBP (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative border border-slate-200 rounded-lg p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-14 w-14 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Evidence preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                          {imageFile?.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {(imageFile!.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeImage}
                      disabled={submitLoading}
                      className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-150 dark:border-slate-850">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitLoading}
                  className="border-slate-250 dark:border-slate-750 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-blue-900 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow font-medium cursor-pointer"
                >
                  {submitLoading ? "Submitting..." : "Submit Complaint"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
