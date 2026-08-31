import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Search,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useRealtimeModule } from "@/hooks/useRealtime";
import { downloadCSV } from "@/lib/csvDownload";
import { PageHeader } from "@/components/PageHeader";
import { trackMeasurementEvent } from "@/analytics";

function TasksContent() {
  const utils = trpc.useUtils();
  const { data: tasks, isLoading } = trpc.tasks.list.useQuery();
  const { data: horses } = trpc.horses.list.useQuery();
  const [localTasks, setLocalTasks] = useState(tasks || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<(typeof localTasks)[0] | null>(null);
  const [editingTask, setEditingTask] = useState<(typeof localTasks)[0] | null>(
    null,
  );
  const [formData, setFormData] = useState({
    horseId: "",
    title: "",
    description: "",
    taskType: "general_care",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: "",
    notes: "",
    reminderDays: "1",
    isRecurring: false,
    recurringInterval: "",
  });
  const [editFormData, setEditFormData] = useState({
    horseId: "",
    title: "",
    description: "",
    taskType: "general_care",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: "",
    notes: "",
  });

  // Real-time updates
  useRealtimeModule("tasks", (action, data) => {
    switch (action) {
      case "created":
        setLocalTasks((prev) => [data, ...prev]);
        toast.success("Task created");
        break;
      case "updated":
        setLocalTasks((prev) =>
          prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)),
        );
        break;
      case "deleted":
        setLocalTasks((prev) => prev.filter((t) => t.id !== data.id));
        toast.success("Task deleted");
        break;
      case "completed":
        setLocalTasks((prev) =>
          prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)),
        );
        toast.success("Task completed!");
        break;
    }
  });

  useEffect(() => {
    if (tasks) setLocalTasks(tasks);
  }, [tasks]);

  const createMutation = trpc.tasks.create.useMutation({
    onSuccess: async () => {
      trackMeasurementEvent("management_task_created", {
        task_type: formData.taskType,
        recurring: formData.isRecurring,
      });
      setIsCreateOpen(false);
      resetForm();
      await utils.tasks.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  const updateMutation = trpc.tasks.update.useMutation({
    onSuccess: async () => {
      setIsEditOpen(false);
      setEditingTask(null);
      await utils.tasks.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  const completeMutation = trpc.tasks.complete.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to complete task");
    },
  });

  const deleteMutation = trpc.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  const exportQuery = trpc.tasks.exportCSV.useQuery(undefined, {
    enabled: false,
  });

  const handleExport = async () => {
    const result = await exportQuery.refetch();
    if (result.data) {
      downloadCSV(result.data.csv, result.data.filename);
    }
  };

  const openView = (task: (typeof localTasks)[0]) => {
    setViewingTask(task);
    setIsViewOpen(true);
  };

  const openEdit = (task: (typeof localTasks)[0]) => {
    setEditingTask(task);
    setEditFormData({
      horseId: task.horseId?.toString() ?? "",
      title: task.title,
      description: task.description ?? "",
      taskType: task.taskType,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
      assignedTo: task.assignedTo ?? "",
      notes: task.notes ?? "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingTask) return;
    if (!editFormData.title) {
      toast.error("Please enter a task title");
      return;
    }
    updateMutation.mutate({
      id: editingTask.id,
      title: editFormData.title,
      description: editFormData.description || undefined,
      taskType: editFormData.taskType as any,
      priority: editFormData.priority as any,
      status: editFormData.status as any,
      dueDate: editFormData.dueDate || undefined,
      assignedTo: editFormData.assignedTo || undefined,
      notes: editFormData.notes || undefined,
    });
  };

  const resetForm = () => {
    setFormData({
      horseId: "",
      title: "",
      description: "",
      taskType: "general_care",
      priority: "medium",
      status: "pending",
      dueDate: "",
      assignedTo: "",
      notes: "",
      reminderDays: "1",
      isRecurring: false,
      recurringInterval: "",
    });
  };

  const handleCreate = () => {
    if (!formData.title) {
      toast.error("Please enter a task title");
      return;
    }

    createMutation.mutate({
      horseId:
        formData.horseId && formData.horseId !== "none"
          ? parseInt(formData.horseId)
          : undefined,
      title: formData.title,
      description: formData.description || undefined,
      taskType: formData.taskType as any,
      priority: formData.priority as any,
      status: formData.status as any,
      dueDate: formData.dueDate || undefined,
      assignedTo: formData.assignedTo || undefined,
      notes: formData.notes || undefined,
      reminderDays: parseInt(formData.reminderDays),
      isRecurring: formData.isRecurring,
      recurringInterval: formData.recurringInterval
        ? (formData.recurringInterval as any)
        : undefined,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getHorseName = (horseId: number | null) => {
    if (!horseId) return "General";
    const horse = horses?.find((h) => h.id === horseId);
    return horse?.name || "Unknown Horse";
  };

  const filteredTasks = searchQuery.trim()
    ? localTasks.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.taskType?.toLowerCase().includes(q) ||
          t.assignedTo?.toLowerCase().includes(q)
        );
      })
    : localTasks;

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageHeader
            title="Tasks"
            subtitle="Manage your horse care tasks and reminders"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-56"
            />
          </div>
          {localTasks.length > 0 && (
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportQuery.isFetching}
            >
              <Download className="w-4 h-4 mr-2" />
              {exportQuery.isFetching ? "Exporting…" : "Export CSV"}
            </Button>
          )}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task or reminder for horse care
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Task Title *</Label>
                <Input
                  id="task-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="E.g., Farrier appointment"
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horse">Horse</Label>
                  <Select
                    value={formData.horseId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, horseId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="General task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">General (all horses)</SelectItem>
                      {horses?.map((horse) => (
                        <SelectItem key={horse.id} value={horse.id.toString()}>
                          {horse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="taskType">Type</Label>
                  <Select
                    value={formData.taskType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, taskType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hoofcare">Hoofcare</SelectItem>
                      <SelectItem value="health_appointment">
                        Health Appointment
                      </SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="deworming">Deworming</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="general_care">General Care</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="feeding">Feeding</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Task details..."
                  rows={3}
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedTo: e.target.value })
                  }
                  placeholder="Person responsible"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* View Task Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewingTask?.title}</DialogTitle>
            <DialogDescription>Task details</DialogDescription>
          </DialogHeader>
          {viewingTask && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(viewingTask.status)}
                <span className="capitalize">{viewingTask.status.replace("_", " ")}</span>
                {getPriorityBadge(viewingTask.priority)}
              </div>
              {viewingTask.description && (
                <p className="text-muted-foreground">{viewingTask.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Horse:</span>{" "}
                  {getHorseName(viewingTask.horseId)}
                </div>
                <div>
                  <span className="font-medium text-foreground">Type:</span>{" "}
                  {viewingTask.taskType.replace(/_/g, " ")}
                </div>
                {viewingTask.dueDate && (
                  <div>
                    <span className="font-medium text-foreground">Due:</span>{" "}
                    {new Date(viewingTask.dueDate).toLocaleDateString()}
                  </div>
                )}
                {viewingTask.assignedTo && (
                  <div>
                    <span className="font-medium text-foreground">Assigned to:</span>{" "}
                    {viewingTask.assignedTo}
                  </div>
                )}
                {viewingTask.notes && (
                  <div className="col-span-2">
                    <span className="font-medium text-foreground">Notes:</span>{" "}
                    {viewingTask.notes}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            {viewingTask && viewingTask.status !== "completed" && (
              <Button
                onClick={() => {
                  setIsViewOpen(false);
                  openEdit(viewingTask);
                }}
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit Task
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Task Title *</Label>
              <Input
                id="edit-task-title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                placeholder="E.g., Farrier appointment"
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-horse">Horse</Label>
                <Select
                  value={editFormData.horseId}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, horseId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="General task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">General (all horses)</SelectItem>
                    {horses?.map((horse) => (
                      <SelectItem key={horse.id} value={horse.id.toString()}>
                        {horse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-taskType">Type</Label>
                <Select
                  value={editFormData.taskType}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, taskType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoofcare">Hoofcare</SelectItem>
                    <SelectItem value="health_appointment">
                      Health Appointment
                    </SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="general_care">General Care</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editFormData.priority}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-task-description">Description</Label>
              <Textarea
                id="edit-task-description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Task details..."
                rows={3}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="edit-assignedTo">Assigned To</Label>
              <Input
                id="edit-assignedTo"
                value={editFormData.assignedTo}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    assignedTo: e.target.value,
                  })
                }
                placeholder="Person responsible"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks ({pendingTasks.length})</CardTitle>
            <CardDescription>Active tasks that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending tasks. Great job!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openView(task)}
                  >
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {getHorseName(task.horseId)}
                          </p>
                          {task.description && (
                            <p
                              className="text-sm text-muted-foreground mt-1 line-clamp-2"
                              title={task.description}
                            >
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(task.priority)}
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View"
                            onClick={(e) => { e.stopPropagation(); openView(task); }}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Edit"
                            onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              completeMutation.mutate({ id: task.id });
                            }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate({ id: task.id });
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks ({completedTasks.length})</CardTitle>
            <CardDescription>Recently completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {completedTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No completed tasks yet
              </div>
            ) : (
              <div className="space-y-2">
                {completedTasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 border rounded-lg opacity-60 hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={() => openView(task)}
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm line-through">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getHorseName(task.horseId)}
                      </p>
                    </div>
                    {task.completedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      title="View"
                      onClick={(e) => { e.stopPropagation(); openView(task); }}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Delete"
                      onClick={(e) => { e.stopPropagation(); deleteMutation.mutate({ id: task.id }); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Tasks() {
  return (
    <DashboardLayout>
      <TasksContent />
    </DashboardLayout>
  );
}
