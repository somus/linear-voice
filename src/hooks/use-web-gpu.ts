import { useEffect, useState } from "react";
import { devLog, isWebGPUSupported } from "@/config";

export function useWebGPU() {
  const [supported, setSupported] = useState<boolean | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: function is stable
  useEffect(() => {
    checkWebGPUSupport();
  }, []);

  async function checkWebGPUSupport() {
    try {
      const result = await isWebGPUSupported();
      setSupported(result);
    } catch (error) {
      devLog.error("Failed to check WebGPU support:", error);
      setSupported(false);
    }
  }

  return { supported, recheckWebGPU: checkWebGPUSupport };
}
