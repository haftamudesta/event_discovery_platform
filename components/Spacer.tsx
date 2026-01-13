import { View, ViewStyle, StyleProp, DimensionValue } from "react-native";
import React from "react";

interface SpacerProps {
  width?: DimensionValue;
  height?: DimensionValue;
  flex?: number;
  debug?: boolean;
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  vertical?: boolean;
  size?: DimensionValue;
}

const Spacer: React.FC<SpacerProps> = ({
  width,
  height,
  flex,
  debug = false,
  style,
  horizontal = false,
  vertical = false,
  size,
}) => {
  const finalWidth: DimensionValue | undefined = horizontal
    ? size || width || 16
    : vertical
    ? undefined
    : width;

  const finalHeight: DimensionValue | undefined = vertical
    ? size || height || 16
    : horizontal
    ? undefined
    : height;

  const spacerStyle: ViewStyle = {
    width: finalWidth,
    height: finalHeight,
    flex: flex,
    backgroundColor: debug ? "rgba(255, 0, 0, 0.1)" : "transparent",
  };

  return <View style={[spacerStyle, style]} />;
};

export default Spacer;
