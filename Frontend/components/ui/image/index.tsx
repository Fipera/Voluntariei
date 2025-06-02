'use client';
import React from 'react';
import { createImage } from '@gluestack-ui/image';
import { Platform, Image as RNImage } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';

const imageStyle = tva({
  base: 'max-w-full',
  variants: {
    size: {
      '4xs': 'h-3 w-3',
      '2xs': 'h-6 w-6',
      'xs': 'h-10 w-10',
      'sm': 'h-16 w-16',
      'md': 'h-20 w-20',
      'lg': 'h-24 w-24',
      'lg2': 'h-32 w-32',
      'xl': 'h-48 w-48',
      '2xl': 'h-64 w-64',
      '3xl': 'h-80 w-80',
      'full': 'h-full w-full',
      'none': '',
    },
  },
});

const UIImage = createImage({ Root: RNImage });

type ImageProps = VariantProps<typeof imageStyle> &
  React.ComponentProps<typeof UIImage>;
const Image = React.forwardRef<
  React.ComponentRef<typeof UIImage>,
  ImageProps & { className?: string }
>(function Image({ size = 'md', className, ...props }, ref) {
  return (
    <UIImage
      className={imageStyle({ size, class: className })}
      {...props}
      ref={ref}
      // @ts-expect-error : web only
      style={
        Platform.OS === 'web'
          ? { height: 'revert-layer', width: 'revert-layer' }
          : undefined
      }
    />
  );
});

Image.displayName = 'Image';
export { Image };
