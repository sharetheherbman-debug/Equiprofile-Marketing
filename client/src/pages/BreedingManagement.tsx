import { useState } from "react";
import { Link } from "wouter";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  Edit,
  Trash2,
  Baby,
  CheckCircle,
  XCircle,
  Calendar,
  Shield,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

function BreedingManagementContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFoalOpen, setIsFoalOpen] = useState(false);
  const [selectedBreeding, setSelectedBreeding] = useState<any>(null);
  const [formData, setFormData] = useState({
    mareId: "",
    stallionName: "",
    breedingDate: new Date().toISOString().split("T")[0],
    method: "natural" as "natural" | "artificial" | "embryo_transfer",
    veterinarianName: "",
    cost: "",
    notes: "",
  });
  const [confirmData, setConfirmData] = useState({
    confirmed: true,
    confirmationDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  });
  const [foalData, setFoalData] = useState({
    birthDate: new Date().toISOString().split("T")[0],
    gender: "colt" as "colt" | "filly",
    name: "",
    color: "",
    birthWeight: "",
  });

  const utils = trpc.useUtils();
  const { data: breedingRecords, isLoading } = trpc.breeding.list.useQuery({});
  const { data: horses } = trpc.horses.list.useQuery();
  const { data: foals } = trpc.breeding.listFoals.useQuery({});

  const createMutation = trpc.breeding.createRecord.useMutation({
    onSuccess: () => {
      toast.success("Breeding record created successfully");
      utils.breeding.list.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.breeding.update.useMutation({
    onSuccess: () => {
      toast.success("Breeding record updated successfully");
      utils.breeding.list.invalidate();
      setIsEditOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.breeding.delete.useMutation({
    onSuccess: () => {
      toast.success("Breeding record deleted successfully");
      utils.breeding.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const confirmMutation = trpc.breeding.confirmPregnancy.useMutation({
    onSuccess: () => {
      toast.success("Pregnancy status updated successfully");
      utils.breeding.list.invalidate();
      setIsConfirmOpen(false);
      setSelectedBreeding(null);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const foalMutation = trpc.breeding.addFoal.useMutation({
    onSuccess: () => {
      toast.success("Foal record created successfully");
      utils.breeding.listFoals.invalidate();
      utils.breeding.list.invalidate();
      setIsFoalOpen(false);
      setSelectedBreeding(null);
      resetFoalForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      mareId: "",
      stallionName: "",
      breedingDate: new Date().toISOString().split("T")[0],
      method: "natural",
      veterinarianName: "",
      cost: "",
      notes: "",
    });
    setSelectedBreeding(null);
  };

  const resetFoalForm = () => {
    setFoalData({
      birthDate: new Date().toISOString().split("T")[0],
      gender: "colt",
      name: "",
      color: "",
      birthWeight: "",
    });
  };

  const handleCreate = () => {
    if (!formData.mareId || !formData.stallionName) {
      toast.error("Mare and stallion are required");
      return;
    }

    createMutation.mutate({
      mareId: parseInt(formData.mareId),
      stallionName: formData.stallionName,
      breedingDate: formData.breedingDate,
      method: formData.method,
      veterinarianName: formData.veterinarianName || undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleEdit = () => {
    if (!selectedBreeding) return;

    updateMutation.mutate({
      id: selectedBreeding.id,
      stallionName: formData.stallionName || undefined,
      breedingDate: formData.breedingDate || undefined,
      method: formData.method,
      veterinarianName: formData.veterinarianName || undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this breeding record?")) {
      deleteMutation.mutate({ id });
    }
  };

  const openEditDialog = (breeding: any) => {
    setSelectedBreeding(breeding);
    setFormData({
      mareId: breeding.mareId?.toString() || "",
      stallionName: breeding.stallionName || "",
      breedingDate: breeding.breedingDate
        ? new Date(breeding.breedingDate).toISOString().split("T")[0]
        : "",
      method: breeding.method || "natural",
      veterinarianName: breeding.veterinarianName || "",
      cost: breeding.cost?.toString() || "",
      notes: breeding.notes || "",
    });
    setIsEditOpen(true);
  };

  const openConfirmDialog = (breeding: any) => {
    setSelectedBreeding(breeding);
    setConfirmData({
      confirmed: !breeding.pregnancyConfirmed,
      confirmationDate: new Date().toISOString().split("T")[0],
      dueDate: "",
    });
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedBreeding) return;

    confirmMutation.mutate({
      id: selectedBreeding.id,
      confirmed: confirmData.confirmed,
      confirmationDate: confirmData.confirmationDate,
      dueDate: confirmData.dueDate || undefined,
    });
  };

  const openFoalDialog = (breeding: any) => {
    setSelectedBreeding(breeding);
    setIsFoalOpen(true);
  };

  const handleAddFoal = () => {
    if (!selectedBreeding) return;

    foalMutation.mutate({
      breedingId: selectedBreeding.id,
      birthDate: foalData.birthDate,
      gender: foalData.gender,
      name: foalData.name || undefined,
      color: foalData.color || undefined,
      birthWeight: foalData.birthWeight
        ? parseFloat(foalData.birthWeight)
        : undefined,
    });
  };

  const getMareName = (mareId: number) => {
    const mare = horses?.find((h) => h.id === mareId);
    return mare?.name || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading breeding records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <PageHeader
            title="Breeding Management"
            subtitle="Track breeding records, pregnancies, and foals"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Breeding Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Breeding Record</DialogTitle>
              <DialogDescription>Record a new breeding event</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mare">Mare *</Label>
                <Select
                  value={formData.mareId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mareId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mare" />
                  </SelectTrigger>
                  <SelectContent>
                    {horses
                      ?.filter((h) => h.gender === "mare")
                      .map((horse) => (
                        <SelectItem key={horse.id} value={horse.id.toString()}>
                          {horse.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stallionName">Stallion Name *</Label>
                <Input
                  id="stallionName"
                  value={formData.stallionName}
                  onChange={(e) =>
                    setFormData({ ...formData, stallionName: e.target.value })
                  }
                  placeholder="Stallion's name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breedingDate">Breeding Date *</Label>
                  <Input
                    id="breedingDate"
                    type="date"
                    value={formData.breedingDate}
                    onChange={(e) =>
                      setFormData({ ...formData, breedingDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="method">Method</Label>
                  <Select
                    value={formData.method}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="artificial">
                        Artificial Insemination
                      </SelectItem>
                      <SelectItem value="embryo_transfer">
                        Embryo Transfer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="veterinarianName">Veterinarian Name</Label>
                <Input
                  id="veterinarianName"
                  value={formData.veterinarianName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      veterinarianName: e.target.value,
                    })
                  }
                  placeholder="Attending veterinarian"
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  placeholder="Breeding cost"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Record"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="breeding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breeding">Breeding Records</TabsTrigger>
          <TabsTrigger value="foals">Foals</TabsTrigger>
        </TabsList>

        <TabsContent value="breeding" className="space-y-4">
          {!breedingRecords || breedingRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Baby className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  No breeding records yet
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start tracking your breeding program
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {breedingRecords.map((breeding) => (
                <Card key={breeding.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {getMareName(breeding.mareId)} ×{" "}
                          {breeding.stallionName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Bred on{" "}
                          {new Date(breeding.breedingDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {breeding.pregnancyConfirmed ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pregnant
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending Confirmation</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Method</p>
                          <p className="font-medium capitalize">
                            {breeding.method.replace("_", " ")}
                          </p>
                        </div>
                        {breeding.veterinarianName && (
                          <div>
                            <p className="text-muted-foreground">
                              Veterinarian
                            </p>
                            <p className="font-medium">
                              {breeding.veterinarianName}
                            </p>
                          </div>
                        )}
                        {breeding.cost && (
                          <div>
                            <p className="text-muted-foreground">Cost</p>
                            <p className="font-medium">£{breeding.cost}</p>
                          </div>
                        )}
                        {breeding.dueDate && (
                          <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className="font-medium">
                              {new Date(breeding.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      {breeding.notes && (
                        <p className="text-sm text-muted-foreground">
                          {breeding.notes}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirmDialog(breeding)}
                        >
                          {breeding.pregnancyConfirmed ? (
                            <XCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {breeding.pregnancyConfirmed
                            ? "Update Status"
                            : "Confirm Pregnancy"}
                        </Button>
                        {breeding.pregnancyConfirmed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openFoalDialog(breeding)}
                          >
                            <Baby className="w-3 h-3 mr-1" />
                            Add Foal
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(breeding)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(breeding.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="foals" className="space-y-4">
          {!foals || foals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Baby className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  No foals recorded yet
                </h3>
                <p className="text-muted-foreground text-center">
                  Foal records will appear here once added to breeding records
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {foals.map((foal) => (
                <Card key={foal.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {foal.name ||
                        `Unnamed ${foal.gender === "colt" ? "Colt" : "Filly"}`}
                    </CardTitle>
                    <CardDescription>
                      Born {new Date(foal.birthDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender</span>
                        <Badge variant="outline" className="capitalize">
                          {foal.gender}
                        </Badge>
                      </div>
                      {foal.color && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Color</span>
                          <span className="font-medium">{foal.color}</span>
                        </div>
                      )}
                      {foal.birthWeight && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Birth Weight
                          </span>
                          <span className="font-medium">
                            {foal.birthWeight} kg
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Breeding Record</DialogTitle>
            <DialogDescription>
              Update breeding record details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-stallionName">Stallion Name</Label>
              <Input
                id="edit-stallionName"
                value={formData.stallionName}
                onChange={(e) =>
                  setFormData({ ...formData, stallionName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-breedingDate">Breeding Date</Label>
                <Input
                  id="edit-breedingDate"
                  type="date"
                  value={formData.breedingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, breedingDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-method">Method</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="artificial">
                      Artificial Insemination
                    </SelectItem>
                    <SelectItem value="embryo_transfer">
                      Embryo Transfer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-veterinarianName">Veterinarian Name</Label>
              <Input
                id="edit-veterinarianName"
                value={formData.veterinarianName}
                onChange={(e) =>
                  setFormData({ ...formData, veterinarianName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-cost">Cost</Label>
              <Input
                id="edit-cost"
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Pregnancy Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Pregnancy</DialogTitle>
            <DialogDescription>
              Update pregnancy status and due date
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirmationDate">Confirmation Date</Label>
              <Input
                id="confirmationDate"
                type="date"
                value={confirmData.confirmationDate}
                onChange={(e) =>
                  setConfirmData({
                    ...confirmData,
                    confirmationDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={confirmData.dueDate}
                onChange={(e) =>
                  setConfirmData({ ...confirmData, dueDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmOpen(false);
                setSelectedBreeding(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Foal Dialog */}
      <Dialog open={isFoalOpen} onOpenChange={setIsFoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Foal</DialogTitle>
            <DialogDescription>Record the birth of a foal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input
                id="birthDate"
                type="date"
                value={foalData.birthDate}
                onChange={(e) =>
                  setFoalData({ ...foalData, birthDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={foalData.gender}
                onValueChange={(value: any) =>
                  setFoalData({ ...foalData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colt">Colt</SelectItem>
                  <SelectItem value="filly">Filly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="foal-name">Name</Label>
              <Input
                id="foal-name"
                value={foalData.name}
                onChange={(e) =>
                  setFoalData({ ...foalData, name: e.target.value })
                }
                placeholder="Foal's name"
              />
            </div>
            <div>
              <Label htmlFor="color">Colour</Label>
              <Input
                id="color"
                value={foalData.color}
                onChange={(e) =>
                  setFoalData({ ...foalData, color: e.target.value })
                }
                placeholder="Coat colour"
              />
            </div>
            <div>
              <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
              <Input
                id="birthWeight"
                type="number"
                value={foalData.birthWeight}
                onChange={(e) =>
                  setFoalData({ ...foalData, birthWeight: e.target.value })
                }
                placeholder="Weight at birth"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFoalOpen(false);
                setSelectedBreeding(null);
                resetFoalForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFoal} disabled={foalMutation.isPending}>
              {foalMutation.isPending ? "Adding..." : "Add Foal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BreedingManagement() {
  const { data: subscriptionStatus, isLoading: subLoading } =
    trpc.user.getSubscriptionStatus.useQuery();
  const isStablePlan =
    subscriptionStatus?.planTier === "stable" ||
    subscriptionStatus?.bothDashboardsUnlocked;

  if (subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isStablePlan) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Stable Plan Required</h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-sm">
            Breeding Management is exclusively for Stable plan subscribers. Upgrade to
            access full breeding records, foal tracking, and more.
          </p>
          <a href="/api/v1/billing/launch?product=management&action=home">
            <Button>
              Upgrade to Stable Plan
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <BreedingManagementContent />
    </DashboardLayout>
  );
}
