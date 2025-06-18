import { type FC } from 'react';;
import { transformToPortableText } from '@kontent-ai/rich-text-resolver';
import { PortableText, type PortableTextReactResolvers } from "@kontent-ai/rich-text-resolver/utils/react";
import type { Elements } from '@kontent-ai/delivery-sdk';
import { SmartLinkLinkedItem } from './SmartLinkLinkedItem';
import { isSmartLinkComponentType, isSmartLinkLinkedItemType, type SmartLinkComponentType, type SmartLinkLinkedItemType, type SmartLinkParentItemType } from '../../models/types';
import { SmartLinkComponent } from './SmartLinkComponent';
import type { CoreType } from '../../models/system';

interface SmartLinkTestItemProps {
  item: SmartLinkParentItemType;
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
          return <SmartLinkComponent item={item as SmartLinkComponentType} />;
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
          <div className="flex flex-col gap-4">
            {item.elements.test_linked_items.linkedItems.map((linkedItem) => (
              <SmartLinkLinkedItem key={linkedItem.system.id} item={linkedItem as SmartLinkLinkedItemType} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartLinkParentComponent;
