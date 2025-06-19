import KontentSmartLink from "@kontent-ai/smart-link";
import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

interface SmartLinkContextValue {
  readonly smartLink?: KontentSmartLink | null;
}

const defaultContextValue: SmartLinkContextValue = {
  smartLink: undefined,
};

export const SmartLinkContext = createContext<SmartLinkContextValue>(defaultContextValue);

export const SmartLinkProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [smartLink, setSmartLink] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const instance = KontentSmartLink.initialize({
      queryParam: 'preview',
      defaultDataAttributes: {
        projectId: import.meta.env.VITE_KONTENT_ENV_ID,
        languageCodename: "default",
      },
      debug: true,
    });

    setSmartLink(instance);

    // Cleanup on component unmount
    return () => {
      smartLink?.destroy();
    };
  }, []);

  const value = useMemo(() => ({ smartLink }), [smartLink]);

  return (
    <SmartLinkContext.Provider value={value}>
      {children}
    </SmartLinkContext.Provider>
  );
};