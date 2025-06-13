import { useEffect, useState } from "react"
import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import { SmartLinkParentComponent } from './components/SmartLinkParentItem';
import type { SmartLinkParentItemType } from "../models/types";

const { VITE_KONTENT_DELIVERY_KEY, VITE_KONTENT_ENV_ID } = import.meta.env;

const deliveryClient = createDeliveryClient({
  environmentId: VITE_KONTENT_ENV_ID, previewApiKey: VITE_KONTENT_DELIVERY_KEY, defaultQueryConfig: {
    usePreviewMode: true,
  }
})

function App() {
  const [data, setData] = useState<SmartLinkParentItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    deliveryClient
      .item<SmartLinkParentItemType>("test_item_1")
      .toPromise()
      .then((item) => {
        setData(item.data.item);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to load data');
        setLoading(false);
      })
  }, [])

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

  if (!data) {
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
        <SmartLinkParentComponent item={data} />
      </div>
    </div>
  )
}

export default App
