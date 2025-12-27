// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = keyof typeof MATERIAL_ICONS_MAPPING | keyof typeof ENTYPO_MAPPING | keyof typeof FONTAWESOME5_MAPPING | keyof typeof FONTAWESOME6_MAPPING;

/**
 * Mappings for different icon libraries.
 */
const MATERIAL_ICONS_MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.circle.fill': 'account-circle',
  'volume.up.fill': 'volume-up',
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'stop.fill': 'stop',
  'speaker.slash.fill': 'volume-off',
  'settings': 'settings',
  'menu': 'menu',
};

const ENTYPO_MAPPING = {
  'message.fill': 'chat',
};

const FONTAWESOME5_MAPPING = {
  'mic.fill': 'microphone-alt',
  'record.fill': 'record-vinyl',
};

const FONTAWESOME6_MAPPING = {
  'bot': 'robot',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  if (name in ENTYPO_MAPPING) {
    return <Entypo color={color} size={size} name={ENTYPO_MAPPING[name as keyof typeof ENTYPO_MAPPING] as any} style={style} />;
  } else if (name in FONTAWESOME5_MAPPING) {
    return <FontAwesome5 color={color} size={size} name={FONTAWESOME5_MAPPING[name as keyof typeof FONTAWESOME5_MAPPING] as any} style={style} />;
  } else if (name in FONTAWESOME6_MAPPING) {
    return <FontAwesome6 color={color} size={24} name={FONTAWESOME6_MAPPING[name as keyof typeof FONTAWESOME6_MAPPING] as any} style={style} />;
  } else {
    return <MaterialIcons color={color} size={size} name={MATERIAL_ICONS_MAPPING[name as keyof typeof MATERIAL_ICONS_MAPPING] as any} style={style} />;
  }
}
