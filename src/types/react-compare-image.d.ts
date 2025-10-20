declare module "react-compare-image" {
  import { Component } from "react";

  interface ReactCompareImageProps {
    leftImage: string;
    rightImage: string;
    sliderPositionPercentage?: number;
    handleSize?: number;
    sliderLineColor?: string;
    sliderLineWidth?: number;
    aspectRatio?: "taller" | "wider";
    hover?: boolean;
    skeleton?: {};
    handle?: React.ReactNode;
  }

  export default class ReactCompareImage extends Component<ReactCompareImageProps> {}
}
