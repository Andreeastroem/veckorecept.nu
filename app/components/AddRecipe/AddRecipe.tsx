"use client";

import { useState } from "react";
import AddRecipeForm from "./Form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function AddRecipe() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <TriggerButton setIsOpen={setIsOpen} />
        </DialogTrigger>
        <DialogContent className="backdrop-blur-sm bg-white w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <AddRecipeForm setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <TriggerButton setIsOpen={setIsOpen} />
      </DrawerTrigger>
      <DrawerContent className="backdrop-blur-sm bg-white w-full">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <AddRecipeForm setIsOpen={setIsOpen} />
      </DrawerContent>
    </Drawer>
  );
}

const title = "Recipe link form";
const description =
  "Submit the link to the recipe you want added. This will be crawled periodically and will not be ready immediately.";

function TriggerButton({ setIsOpen }: { setIsOpen: React.Dispatch<boolean> }) {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="w-full font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-ring/30 backdrop-blur-sm border border-border transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ring/40"
    >
      Add recipe
    </button>
  );
}
