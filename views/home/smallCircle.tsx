import React from 'react';
import { View } from 'react-native';

interface CircleProps {
    radius: number;
    color: string;
  }


const Circle = ({ radius, color }: CircleProps) => {
  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        backgroundColor: color,
      }}
    />
  );
};

export default Circle;