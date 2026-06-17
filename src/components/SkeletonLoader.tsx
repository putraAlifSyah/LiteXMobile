import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { BorderRadius, Spacing } from '../constants/spacing';
import { useSettingsStore } from '../store/settingsStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SkeletonVariant = 'card' | 'horizontal' | 'detail';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
}

// ---------------------------------------------------------------------------
// Shimmer hook
// ---------------------------------------------------------------------------

function useShimmer() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animatedValue]);

  return animatedValue;
}

// ---------------------------------------------------------------------------
// Bone (single shimmer block)
// ---------------------------------------------------------------------------

interface BoneProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: object;
  shimmer: Animated.Value;
  baseColor: string;
  highlightColor: string;
}

const Bone: React.FC<BoneProps> = ({
  width,
  height,
  borderRadius = BorderRadius.sm,
  style,
  shimmer,
  baseColor,
  highlightColor,
}) => {
  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [baseColor, highlightColor],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// Variant renderers
// ---------------------------------------------------------------------------

interface VariantRendererProps {
  shimmer: Animated.Value;
  baseColor: string;
  highlightColor: string;
}

const CardSkeleton: React.FC<VariantRendererProps> = ({
  shimmer,
  baseColor,
  highlightColor,
}) => (
  <View style={styles.cardContainer}>
    {/* Image placeholder */}
    <Bone
      width="100%"
      height={180}
      borderRadius={0}
      shimmer={shimmer}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
    <View style={styles.cardBody}>
      {/* Category + time */}
      <View style={styles.row}>
        <Bone
          width={70}
          height={14}
          shimmer={shimmer}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
        <Bone
          width={80}
          height={12}
          shimmer={shimmer}
          baseColor={baseColor}
          highlightColor={highlightColor}
          style={{ marginLeft: 'auto' }}
        />
      </View>
      {/* Title line 1 */}
      <Bone
        width="100%"
        height={16}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.sm }}
      />
      {/* Title line 2 */}
      <Bone
        width="70%"
        height={16}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.xs }}
      />
      {/* Excerpt */}
      <Bone
        width="90%"
        height={12}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.sm }}
      />
      <Bone
        width="60%"
        height={12}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.xs }}
      />
    </View>
  </View>
);

const HorizontalSkeleton: React.FC<VariantRendererProps> = ({
  shimmer,
  baseColor,
  highlightColor,
}) => (
  <View style={styles.horizontalContainer}>
    {/* Image */}
    <Bone
      width={100}
      height={100}
      borderRadius={BorderRadius.md}
      shimmer={shimmer}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
    {/* Text area */}
    <View style={styles.horizontalBody}>
      <Bone
        width={60}
        height={12}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
      <Bone
        width="100%"
        height={14}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.sm }}
      />
      <Bone
        width="80%"
        height={14}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.xs }}
      />
      <Bone
        width={70}
        height={10}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: 'auto' }}
      />
    </View>
  </View>
);

const DetailSkeleton: React.FC<VariantRendererProps> = ({
  shimmer,
  baseColor,
  highlightColor,
}) => (
  <View style={styles.detailContainer}>
    {/* Hero image */}
    <Bone
      width="100%"
      height={220}
      borderRadius={0}
      shimmer={shimmer}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
    <View style={styles.detailBody}>
      {/* Category */}
      <Bone
        width={80}
        height={14}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
      {/* Title */}
      <Bone
        width="100%"
        height={22}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.md }}
      />
      <Bone
        width="85%"
        height={22}
        shimmer={shimmer}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ marginTop: Spacing.xs }}
      />
      {/* Author row */}
      <View style={[styles.row, { marginTop: Spacing.base }]}>
        <Bone
          width={32}
          height={32}
          borderRadius={16}
          shimmer={shimmer}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
        <View style={{ marginLeft: Spacing.sm }}>
          <Bone
            width={100}
            height={12}
            shimmer={shimmer}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
          <Bone
            width={70}
            height={10}
            shimmer={shimmer}
            baseColor={baseColor}
            highlightColor={highlightColor}
            style={{ marginTop: Spacing.xs }}
          />
        </View>
      </View>
      {/* Content lines */}
      {[1, 2, 3, 4, 5].map((i) => (
        <Bone
          key={i}
          width={i === 5 ? '50%' : '100%'}
          height={14}
          shimmer={shimmer}
          baseColor={baseColor}
          highlightColor={highlightColor}
          style={{ marginTop: Spacing.sm }}
        />
      ))}
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
}) => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);
  const shimmer = useShimmer();

  const baseColor = isDarkMode ? Colors.dark.skeleton : Colors.skeleton;
  const highlightColor = isDarkMode ? Colors.dark.surfaceVariant : '#F0F0F0';

  const renderSkeleton = (key: number) => {
    const props: VariantRendererProps = { shimmer, baseColor, highlightColor };

    switch (variant) {
      case 'horizontal':
        return <HorizontalSkeleton key={key} {...props} />;
      case 'detail':
        return <DetailSkeleton key={key} {...props} />;
      case 'card':
      default:
        return <CardSkeleton key={key} {...props} />;
    }
  };

  return <>{Array.from({ length: count }, (_, i) => renderSkeleton(i))}</>;
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  /* Card variant */
  cardContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.base,
  },
  cardBody: {
    padding: Spacing.md,
  },

  /* Horizontal variant */
  horizontalContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  horizontalBody: {
    flex: 1,
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
  },

  /* Detail variant */
  detailContainer: {
    flex: 1,
  },
  detailBody: {
    padding: Spacing.base,
  },

  /* Shared */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SkeletonLoader;
