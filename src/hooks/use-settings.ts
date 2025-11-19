import { useEffect, useState } from "react";
import { devLog, getDefaultSettings, type Settings } from "@/config";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());
  const [isSaving, setIsSaving] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: function is stable
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const result = await chrome.storage.local.get("settings");
      if (result.settings) {
        setSettings({ ...getDefaultSettings(), ...result.settings });
      }
    } catch (err) {
      devLog.error("Failed to load settings:", err);
    }
  }

  async function saveSettings() {
    setIsSaving(true);
    try {
      await chrome.storage.local.set({ settings });
      // Show brief feedback
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      devLog.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    settings,
    setSettings,
    saveSettings,
    isSaving,
  };
}
