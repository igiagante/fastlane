"use client";

import { useMobile } from "../hooks/use-mobile";
import PayPalFastlane from "./paypal-fastlane";
import PayPalDrawer from "./drawer";

export default function Checkout() {
  const isMobile = useMobile();

  return isMobile ? <PayPalDrawer /> : <PayPalFastlane />;
}
