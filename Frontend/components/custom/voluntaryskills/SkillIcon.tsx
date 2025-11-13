import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  size?: number; 
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
};

export const SkillIcon: React.FC<Props> = ({
  source,
  size = 64,
  borderColor = '#173663',
  borderWidth = 2,
  backgroundColor = '#CBD5E0',
}) => {
  const radius = size / 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
        borderColor,
        borderWidth,
      }}
    >
      <Image source={source} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

export default SkillIcon;
