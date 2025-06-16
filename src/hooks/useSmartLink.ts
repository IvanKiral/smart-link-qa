import { useContext, useEffect } from "react";
import KontentSmartLink, { KontentSmartLinkEvent, type IRefreshMessageData, type IRefreshMessageMetadata, type IUpdateMessageData } from "@kontent-ai/smart-link";
import { SmartLinkContext } from "../contexts/SmartLinkContext";

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

      return () => smartLink.off(KontentSmartLinkEvent.Refresh, callback);
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

      return () => {
        smartLink.off(KontentSmartLinkEvent.Update, callback);
      }
    }

    return;
  }, [smartLink, callback]);
}; 