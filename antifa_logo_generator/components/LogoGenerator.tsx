"use client";

import { useState } from "react";
import Settings from "./settings_pannel/Settings";
import PreviewPanel from "./preview_pannel/PreviewPanel";

export interface LogoSettings {
  topText: string;
  bottomText: string;
  rbSplit: number;
  scale: number;
  posX: number;
  posY: number;
  fontSize: number;
  logoFile: File | null;
  customLogoColorEnabled: boolean;
}

const initialSettings: LogoSettings = {
  topText: "ANTIFASCIST",
  bottomText: "ACTION",
  rbSplit: 50,
  scale: 100,
  posX: 0,
  posY: 0,
  fontSize: 40,
  logoFile: null,
  customLogoColorEnabled: false,
};

export default function LogoGenerator() {
  const [settings, setSettings] = useState<LogoSettings>(initialSettings);

  return (
    <div className="container">
      <Settings settings={settings} onChange={setSettings} />
      <PreviewPanel settings={settings} />
    </div>
  );
}
