import React from 'react';
import Svg, { Rect, Polygon } from 'react-native-svg';
import { Dimensions, StatusBar } from 'react-native';
import { BackgroundPatterns } from '../../constants/theme';

interface BackgroundPatternProps {
  size?: number;
  gender: 'Man' | 'Woman';
  colorScheme: 'light' | 'dark';
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ size, gender, colorScheme }) => {
  const svgWidth = size || windowWidth;
  const svgHeight = size ? size : windowHeight;

  // Obtener colores basados en género y esquema de color
  const backgroundColors = BackgroundPatterns.gender[gender][colorScheme];

  // Definimos los puntos de los polígonos
  const points = {
    poly1: [
      `${svgWidth * 0.3},0`,
      `${svgWidth},0`,
      `${svgWidth},${svgHeight * 1}`,
      `${svgWidth * 3.3},${svgHeight}`
    ].join(' '),
    poly2: [
      `${svgWidth * 0.3},0`,
      `${svgWidth},0`,
      `${svgWidth},${svgHeight * 1}`,
      `${svgWidth * 4},${svgHeight}`
    ].join(' '),
    poly3: [
      `0,${svgHeight * 0.7}`,
      `${svgWidth * 0.95},${svgHeight}`,
      `0,${svgHeight}`
    ].join(' '),
    poly4: [
      `0,${svgHeight * 0.7}`,
      `${svgWidth * 0.76},${svgHeight}`,
      `0,${svgHeight}`
    ].join(' '),
    };

  return (
    <Svg
      height={svgHeight}
      width={svgWidth}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{
        position: 'absolute',
        top: StatusBar.currentHeight || 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
      }}
    >
      {/* Fondo base */}
      <Rect x="0" y="0" width={svgWidth} height={svgHeight} fill={backgroundColors.tone1} />

      {/* Objeto 1: */}
      <Polygon points={points.poly1} fill={backgroundColors.tone3} />

      {/* Objeto 2: */}
      <Polygon points={points.poly2} fill={backgroundColors.tone2} />

      {/* Objeto 3: */}
      <Polygon points={points.poly3} fill={backgroundColors.tone3} />

      {/* Objeto 4: */}
      <Polygon points={points.poly4} fill={backgroundColors.tone2} />
    </Svg>
  );
};
