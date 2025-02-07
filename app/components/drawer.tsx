"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PayPalFastlane from "./paypal-fastlane";
import { useState } from "react";

export default function PayPalDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Open Checkout
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Complete Your Purchase</DrawerTitle>
          <DrawerDescription>
            Enter your email and proceed with PayPal checkout.
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4">
          {/* Render the PayPalFastlane component inside the drawer */}
          <PayPalFastlane onClose={() => setOpen(false)} />
        </div>
        <DrawerFooter>
          <button className="btn" onClick={() => setOpen(false)}>
            Close
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
