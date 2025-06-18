import { type FC } from 'react';
import { transformToPortableText } from '@kontent-ai/rich-text-resolver';
import { PortableText, type PortableTextReactResolvers } from "@kontent-ai/rich-text-resolver/utils/react";
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { SmartLinkComponentType } from '../../models/types/smartLinkComponentType.type';
import type { SmartLinkLinkedItemType } from '../../models/types';
import { SmartLinkLinkedItem } from './SmartLinkLinkedItem';

interface SmartLinkComponentProps {
  item: SmartLinkComponentType;
}

const createComponents = (richElement: Elements.RichTextElement): PortableTextReactResolvers => {
  return {
    types: {
      componentOrItem: ({ value }) => {
        const item = richElement.linkedItems.find(item => item.system.codename === value.componentOrItem._ref);
        if (!item) {
          return <div>Not found Component or item: {value.componentOrItem.value}</div>;
        }
        if (item.system.type === 'smart_link_component') {
          return <SmartLinkComponent item={item as SmartLinkComponentType} />;
        }
        if (item.system.type === 'smart_link_linked_item') {
          return <SmartLinkLinkedItem item={item as SmartLinkLinkedItemType} />;
        }
        return <div>Component or item: {item.system.type}</div>;
      },
    },
  }
};

export const SmartLinkComponent: FC<SmartLinkComponentProps> = ({ item }) => {
  // Transform rich text to portable text for rendering
  const richTextContent = item.elements.rich_text.value
    ? transformToPortableText(item.elements.rich_text.value)
    : null;

  return (
    <div className="bg-green-100 rounded-lg shadow-2xl p-8 mt-6"
      data-kontent-component-id={item.system.id}
      data-kontent-add-button
      data-kontent-add-button-insert-position="after"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">COMPONENT</h2>
      {/* Title */}
      {item.elements.title.value && (
        <div className="mb-8 border-2 border-blue-200 rounded-lg p-6"
          data-kontent-element-codename={'title'}
        >
          <p className="text-gray-700 text-lg leading-relaxed">
            {item.elements.title.value}
          </p>
        </div>
      )}

      {/* Rich Text */}
      {item.elements.rich_text.value && richTextContent && (
        <div className="mb-8 border-2 border-green-200 rounded-lg p-6"
          data-kontent-element-codename={'rich_text'}
        >
          <div className="prose prose-gray max-w-none">
            <PortableText value={richTextContent} components={createComponents(item.elements.rich_text)} />
          </div>
        </div>
      )}

      {/* Linked Items Summary */}
      {item.elements.linked_items.value && item.elements.linked_items.value.length > 0 && (
        <div className="mb-8 border-2 border-purple-200 rounded-lg p-6"
          data-kontent-element-codename={'linked_items'}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Linked Items
          </h2>
          <div className="flex flex-col gap-4">
            {item.elements.linked_items.linkedItems.map((linkedItem) => (
              <SmartLinkLinkedItem key={linkedItem.system.id} item={linkedItem as SmartLinkLinkedItemType} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};