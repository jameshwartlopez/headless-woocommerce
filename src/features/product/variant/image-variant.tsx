import { find, isEmpty } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { useProductContext } from '@src/context/product-context';
import { Attribute, Image as ImageType } from '@src/models/product/types';
import { cn } from '@src/lib/helpers/helper';
import { useAttributeParams } from '@src/lib/hooks/product';

type Props = {
  attribute: Attribute;
  image?: ImageType[];
};

export const ImageVariant: React.FC<Props> = ({ attribute }) => {
  const attributeParams = useAttributeParams();

  const {
    product,
    actions: { onAttributeSelect },
    variation: {
      image: [, setImageThumbnailAttribute],
    },
  } = useProductContext();
  const { name, label, options } = attribute;
  const attributeImageSrc = product?.variantImageSrc;

  const [currentAttributeLabel, setCurrentAttributeLabel] = useState('');

  useEffect(() => {
    if (!isEmpty(attributeParams[name]) && !isEmpty(name)) {
      const foundAttribute = find(attributeImageSrc, attributeParams);
      if (!isEmpty(foundAttribute)) {
        setImageThumbnailAttribute(foundAttribute as ImageType);
      }

      const foundLabel = find(options, { slug: attributeParams[name] });
      if (!isEmpty(foundLabel)) {
        setCurrentAttributeLabel(foundLabel.label);
      }
      onAttributeSelect(name, attributeParams[name]);
    }
  }, [attributeParams]);

  if (isEmpty(product?.variantImageSrc)) return null;

  const handleOnClick = (variantImageSrc: ImageType, variantName: string, variantLabel: string) => {
    setCurrentAttributeLabel(variantLabel);
    setImageThumbnailAttribute(variantImageSrc as ImageType);
    onAttributeSelect(name, variantName);
  };

  return (
    <div className="mb-4">
      <label
        className="block text-sm font-bold mb-1 capitalize"
        htmlFor={name}
      >
        {label}: <span className="font-medium">{currentAttributeLabel}</span>
      </label>
      <div className="flex space-x-2.5 mt-2.5">
        {options?.map((option) => {
          const currentImageSrc = find(attributeImageSrc, [name, option.name]);
          return (
            <div
              key={v4()}
              className={cn('w-10 h-10 border border-[#56575A] rounded-sm', {
                'opacity-60': option.label !== currentAttributeLabel,
                'opacity-100': option.label === currentAttributeLabel,
              })}
              onClick={() => handleOnClick(currentImageSrc as ImageType, option.name, option.label)}
            >
              <Image
                className="w-full h-full"
                src={currentImageSrc?.src as string}
                alt={(currentImageSrc?.altText as string) || option.label}
                width={100}
                height={100}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
