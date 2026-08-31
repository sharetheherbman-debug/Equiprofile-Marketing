import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "wouter";
import { trackMeasurementEvent } from "@/analytics";

const disciplines = [
  "Dressage",
  "Show Jumping",
  "Eventing",
  "Western",
  "Endurance",
  "Polo",
  "Racing",
  "Trail Riding",
  "Driving",
  "Other",
];

const levels = [
  "Beginner",
  "Novice",
  "Intermediate",
  "Advanced",
  "Competition",
  "Professional",
];

function HorseFormContent() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const isEditing = params.id && params.id !== "new";
  const horseId = isEditing ? parseInt(params.id!) : null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  // Staged file — selected by user but not yet uploaded to server
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const stagedBlobRef = useRef<string>("");

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    color: "",
    gender: "" as "" | "stallion" | "mare" | "gelding",
    discipline: "",
    level: "",
    registrationNumber: "",
    microchipNumber: "",
    notes: "",
    photoUrl: "",
  });

  const { data: horse, isLoading: horseLoading } = trpc.horses.get.useQuery(
    { id: horseId! },
    { enabled: !!horseId },
  );

  const uploadMutation = trpc.documents.upload.useMutation();

  const createMutation = trpc.horses.create.useMutation({
    onSuccess: (data) => {
      trackMeasurementEvent("horse_record_created", {
        record_type: "horse_profile",
      });
      utils.horses.list.invalidate();
      utils.user.getDashboardStats.invalidate();
      toast.success("Horse added successfully!");
      navigate(`/horses/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add horse");
    },
  });

  const updateMutation = trpc.horses.update.useMutation({
    onSuccess: () => {
      utils.horses.list.invalidate();
      utils.user.getDashboardStats.invalidate();
      toast.success("Horse updated successfully!");
      navigate(`/horses/${horseId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update horse");
    },
  });

  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || "",
        breed: horse.breed || "",
        age: horse.age?.toString() || "",
        dateOfBirth: horse.dateOfBirth
          ? new Date(horse.dateOfBirth).toISOString().split("T")[0]
          : "",
        height: horse.height ? (horse.height / 10).toString() : "",
        weight: horse.weight?.toString() || "",
        color: horse.color || "",
        gender: (horse.gender as "" | "stallion" | "mare" | "gelding") || "",
        discipline: horse.discipline || "",
        level: horse.level || "",
        registrationNumber: horse.registrationNumber || "",
        microchipNumber: horse.microchipNumber || "",
        notes: horse.notes || "",
        photoUrl: horse.photoUrl || "",
      });
      if (horse.photoUrl) setPhotoPreview(horse.photoUrl);
    }
  }, [horse]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP, etc.)");
      if (e.target) e.target.value = "";
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Photo must be under 5MB");
      if (e.target) e.target.value = "";
      return;
    }
    // Revoke any previous staged blob URL
    if (stagedBlobRef.current) {
      URL.revokeObjectURL(stagedBlobRef.current);
    }
    // Show local preview — nothing is uploaded yet
    const objectUrl = URL.createObjectURL(file);
    stagedBlobRef.current = objectUrl;
    setPhotoPreview(objectUrl);
    setStagedFile(file);
    // Clear any previously-saved server URL so the staged file is used on submit
    setFormData((prev) => ({ ...prev, photoUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a name for your horse");
      return;
    }

    let resolvedPhotoUrl = formData.photoUrl;

    // Upload staged photo now (only when user actually saves)
    if (stagedFile) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const result = ev.target?.result;
            if (typeof result === "string" && result.includes(",")) {
              resolve(result);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(stagedFile);
        });
        const base64 = dataUrl.split(",")[1];
        const result = await uploadMutation.mutateAsync({
          fileName: stagedFile.name,
          fileType: stagedFile.type,
          fileSize: stagedFile.size,
          fileData: base64,
          category: "other",
          description: "Horse profile photo",
        });
        resolvedPhotoUrl = result.url;
        // Revoke staged blob — we now have a real server URL
        if (stagedBlobRef.current) {
          URL.revokeObjectURL(stagedBlobRef.current);
          stagedBlobRef.current = "";
        }
        setStagedFile(null);
      } catch (err: any) {
        const msg: string = err?.message || "";
        // A JSON parse error typically means the server returned HTML (e.g. a
        // proxy error page) instead of a tRPC response.  Surface a clear
        // human-readable message instead of the raw "Unexpected token <" noise.
        if (msg.includes("Unexpected token") || msg.includes("JSON") || msg.includes("json")) {
          toast.error("Upload failed — the server returned an unexpected response. Please try again or use a smaller image.");
        } else if (msg.includes("10MB") || msg.includes("10 MB") || msg.includes("size")) {
          toast.error("Photo is too large. Please use an image under 10MB.");
        } else {
          toast.error(msg || "Failed to upload photo. Please try again.");
        }
        return;
      }
    }

    const data = {
      name: formData.name,
      breed: formData.breed || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      height: formData.height ? Math.round(parseFloat(formData.height) * 10) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      color: formData.color || undefined,
      gender: formData.gender || undefined,
      discipline: formData.discipline || undefined,
      level: formData.level || undefined,
      registrationNumber: formData.registrationNumber || undefined,
      microchipNumber: formData.microchipNumber || undefined,
      notes: formData.notes || undefined,
      photoUrl: resolvedPhotoUrl || undefined,
    };

    if (isEditing && horseId) {
      updateMutation.mutate({ id: horseId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  if (horseLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/horses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <PageHeader
          title={isEditing ? "Edit Horse" : "Add New Horse"}
          subtitle={isEditing
            ? "Update your horse's information"
            : "Enter details about your equine companion"}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your horse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter horse's name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData({ ...formData, breed: e.target.value })
                  }
                  placeholder="e.g., Thoroughbred, Arabian"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  autoComplete="bday"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value as any })
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stallion">Stallion</SelectItem>
                    <SelectItem value="mare">Mare</SelectItem>
                    <SelectItem value="gelding">Gelding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (hh)</Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  max="25"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  placeholder="e.g. 15.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="1500"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="Weight in kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Colour</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="e.g., Bay, Chestnut"
                  autoComplete="off"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Training & Discipline</CardTitle>
            <CardDescription>
              Your horse's specialty and skill level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discipline">Discipline</Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value) =>
                    setFormData({ ...formData, discipline: value })
                  }
                >
                  <SelectTrigger id="discipline">
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Identification</CardTitle>
            <CardDescription>
              Registration and identification numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                  placeholder="Passport/registration number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="microchipNumber">Microchip Number</Label>
                <Input
                  id="microchipNumber"
                  value={formData.microchipNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      microchipNumber: e.target.value,
                    })
                  }
                  placeholder="Microchip ID"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Photo and notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <div className="flex items-start gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Horse preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/marketing/brand/horse-1.svg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview("");
                        setStagedFile(null);
                        if (stagedBlobRef.current) {
                          URL.revokeObjectURL(stagedBlobRef.current);
                          stagedBlobRef.current = "";
                        }
                        setFormData((prev) => ({ ...prev, photoUrl: "" }));
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                    <Upload className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="photo"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {photoPreview ? "Change Photo" : "Select Photo"}
                    </>
                  </Button>
                  {stagedFile && (
                    <p className="text-xs text-muted-foreground">
                      Photo staged — will upload when you save.
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP or HEIC. Max 5MB.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional notes about your horse..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6">
          <Link href="/horses" className="block">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Update Horse" : "Add Horse"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function HorseForm() {
  return (
    <DashboardLayout>
      <HorseFormContent />
    </DashboardLayout>
  );
}
