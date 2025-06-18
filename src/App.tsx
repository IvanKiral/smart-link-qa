import { useCallback, useEffect, useState } from "react"
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import { SmartLinkParentComponent } from './components/SmartLinkParentItem';
import type { SmartLinkParentItemType } from "../models/types";
import { useCustomRefresh, useLivePreview } from "./hooks/useSmartLink";
import { applyUpdateOnItemAndLoadLinkedItems, type IRefreshMessageData, type IRefreshMessageMetadata, type IUpdateMessageData, } from "@kontent-ai/smart-link";

const { VITE_KONTENT_DELIVERY_KEY, VITE_KONTENT_ENV_ID } = import.meta.env;

const deliveryClient = createDeliveryClient({
  environmentId: VITE_KONTENT_ENV_ID, previewApiKey: VITE_KONTENT_DELIVERY_KEY, defaultQueryConfig: {
    usePreviewMode: true,
    waitForLoadingNewContent: true,
  }
})

function App() {
  const [item, setItem] = useState<SmartLinkParentItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    deliveryClient
      .item<SmartLinkParentItemType>("test_item_1")
      .toPromise()
      .then((item) => {
        setItem(item.data.item);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to load data');
        setLoading(false);
      })
  }, [])

  const handleLiveUpdate = useCallback((data: IUpdateMessageData) => {
    if (!item) {
      return;
    }

    console.log("KSL: HandleLiveUpdate", data);

    // const updatedItem = applyUpdateOnItem(item, data);
    // console.log("KSL: updatedItem", updatedItem);
    // setItem(updatedItem as SmartLinkParentItemType);

    applyUpdateOnItemAndLoadLinkedItems(
      item,
      data,
      (codenames) => {
        console.log("KSL: codenames", codenames);
        const query = deliveryClient.items().inFilter("system.codename", [...codenames]);
        console.log("KSL: url", query.getUrl());

        return new Promise((resolve) => {
          const pollInterval = 1000; // 1000ms between polls
          let attempts = 0;

          const poll = async () => {
            attempts++;
            console.log(`KSL: Polling attempt ${attempts} for codenames:`, codenames);

            try {
              const response = await query.toPromise();
              const fetchedItems = response.data.items;
              const fetchedCodenames = fetchedItems.map(item => item.system.codename);

              console.log("KSL: fetched codenames:", fetchedCodenames);
              console.log("KSL: required codenames:", codenames);

              // Check if we have all required items
              const hasAllItems = codenames.every(codename =>
                fetchedCodenames.includes(codename)
              );

              if (hasAllItems) {
                console.log("KSL: All items found, resolving");
                resolve(fetchedItems);
              } else {
                console.log(`KSL: Missing items, retrying in ${pollInterval}ms...`);
                setTimeout(poll, pollInterval);
              }
            } catch (error) {
              console.error("KSL: Error during polling:", error);
              setTimeout(poll, pollInterval);
            }
          };

          poll();
        });
      }
    ).then((item) => {
      console.log("KSL: item in live update", item);
      setItem(item as SmartLinkParentItemType);
    });
  }, [item]);

  const handleCustomRefresh = useCallback((_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
    if (metadata.manualRefresh) {
      originalRefresh();
    }
  }, [])

  useLivePreview(handleLiveUpdate);
  useCustomRefresh(handleCustomRefresh);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Smart Link Test Item
        </h1>
        <SmartLinkParentComponent item={item} />
      </div>
    </div>
  )
}

export default App
