import { NewPechaForm, PechaFromOpenPecha } from "./Forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import PlusIcon from "@/assets/plus.png";
function DocumentCreateModal() {
  const [projectName, setProjectName] = useState("");
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer ">
        <div className="border rounded-lg p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer mb-12 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center">
            <div className=" p-4 rounded-full flex items-center justify-center  transition-colors">
              <img src={PlusIcon} width={70} alt="" />
            </div>
            <p className="mt-4 text-sm text-gray-600">Create New Project</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%] w-[95%] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Create Translation Project
          </DialogTitle>
        </DialogHeader>
        <div className="grid w-full items-center gap-1.5 mb-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            className="w-full"
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="cursor-pointer">
              Upload File
            </TabsTrigger>
            <TabsTrigger value="OpenPecha" className="cursor-pointer">
              OpenPecha URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <NewPechaForm projectName={projectName} closeModal={closeModal} />
          </TabsContent>
          <TabsContent value="OpenPecha">
            <PechaFromOpenPecha closeModal={closeModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentCreateModal;
