declare module "react-compare-image" {
  export interface ReactCompareImageProps {
    onSliderPositionChange?: (position: number) => void;
    skeleton?: React.ReactNode;
    handle?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
}
