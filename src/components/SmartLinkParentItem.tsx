import { type FC } from 'react';;
import { transformToPortableText } from '@kontent-ai/rich-text-resolver';
import { PortableText, type PortableTextReactResolvers } from "@kontent-ai/rich-text-resolver/utils/react";
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { SmartLinkParentItem } from '../../models/content-types/smart_link_parent_item';
import { SmartLinkLinkedItem } from './SmartLinkLinkedItem';
import { isSmartLinkComponentType, isSmartLinkLinkedItemType, type SmartLinkLinkedItemType } from '../../models/types';
import { SmartLinkComponent } from './SmartLinkComponent';
import type { CoreType } from '../../models/system';
import { useSmartLink } from '../contexts/SmartLinkContext';

interface SmartLinkTestItemProps {
  item: SmartLinkParentItem;
}

const createComponents = (richElement: Elements.RichTextElement<CoreType>): PortableTextReactResolvers => {
  return {
    types: {
      componentOrItem: ({ value }) => {
        const item = richElement.linkedItems.find(item => item.system.codename === value.componentOrItem._ref);
        if (!item) {
          return <div>Not found Component or item: {value.componentOrItem._ref}</div>;
        }
        if (isSmartLinkComponentType(item)) {
          return <SmartLinkComponent item={item as SmartLinkParentItem} />;
        }
        if (isSmartLinkLinkedItemType(item)) {
          return <SmartLinkLinkedItem item={item as SmartLinkLinkedItemType} />;
        }
        return <div>Component or item: {item.system.type}</div>;
      },
    },
  }
};

export const SmartLinkParentComponent: FC<SmartLinkTestItemProps> = ({ item }) => {
  console.log(item);

  const smartLink = useSmartLink();
  console.log(smartLink);
  // Transform rich text to portable text for rendering
  const richTextContent = item.elements.test_rich_text.value
    ? transformToPortableText(item.elements.test_rich_text.value)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-6"
      data-kontent-item-id={item.system.id}
    >
      {/* Test Text */}
      {item.elements.test_text.value && (
        <div className="mb-8 border-2 border-blue-200 rounded-lg p-6"
          data-kontent-element-codename={'test_text'}
        >
          <p className="text-gray-700 text-lg leading-relaxed">
            {item.elements.test_text.value}
          </p>
        </div>
      )}

      {/* Test Rich Text */}
      {item.elements.test_rich_text.value && richTextContent && (
        <div className="mb-8 border-2 border-green-200 rounded-lg p-6"
          data-kontent-element-codename={'test_rich_text'}
        >
          <div className="prose prose-gray max-w-none">
            <PortableText value={richTextContent} components={createComponents(item.elements.test_rich_text)} />
          </div>
        </div>
      )}

      {/* Test Linked Items Summary */}
      {item.elements.test_linked_items.value && item.elements.test_linked_items.value.length > 0 && (
        <div className="mb-8 border-2 border-purple-200 rounded-lg p-6"
          data-kontent-element-codename={'test_linked_items'}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Test Linked Items
          </h2>
          <p className="text-gray-700">
            This item has {item.elements.test_linked_items.value.length} linked item(s).
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Linked items are referenced but detailed display is handled by the parent application.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartLinkParentComponent;
