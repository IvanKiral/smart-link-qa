import KontentSmartLink, { KontentSmartLinkEvent, type IRefreshMessageData, type IRefreshMessageMetadata, type IUpdateMessageData } from "@kontent-ai/smart-link";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

interface SmartLinkContextValue {
  readonly smartLink?: KontentSmartLink | null;
}

const defaultContextValue: SmartLinkContextValue = {
  smartLink: undefined,
};

const SmartLinkContext = createContext<SmartLinkContextValue>(defaultContextValue);

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
      forceWebSpotlightMode: true
    });

    setSmartLink(instance);

    console.log('SmartLink initialized');
    // Cleanup on component unmount
    return () => {
      console.log('SmartLink destroyed');
      instance.destroy();
    };
  }, []);

  const value = useMemo(() => ({ smartLink }), [smartLink]);

  return (
    <SmartLinkContext.Provider value={value}>
      {children}
    </SmartLinkContext.Provider>
  );
};

// Custom hook for easy access to the SmartLink instance
export const useSmartLink = (): KontentSmartLink | null => {
  const { smartLink } = useContext(SmartLinkContext);

  if (typeof smartLink === 'undefined') {
    throw new Error('You need to place SmartLinkProvider to one of the parent components to use useSmartLink.');
  }

  return smartLink;
};

// Custom hook for easy setup of a custom refresh handler
export const useCustomRefresh = (callback: (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Refresh, callback);

      return smartLink.off(KontentSmartLinkEvent.Refresh, callback);
    }

    return;
  }, [smartLink, callback]);
};

// Custom hook for easy access of live preview
export const useLivePreview = (callback: (data: IUpdateMessageData) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, callback);

      return smartLink.off(KontentSmartLinkEvent.Update, callback);
    }

    return;
  }, [smartLink, callback]);
};