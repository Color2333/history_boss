declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, options?: MapOptions);
    setFitView(): void;
    destroy(): void;
    addControl(control: Control): void;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setMap(map: Map | null): void;
  }

  class Polyline {
    constructor(options?: PolylineOptions);
    setMap(map: Map | null): void;
  }

  class Scale extends Control {}
  class ToolBar extends Control {}

  class Control {
    constructor();
  }

  interface MapOptions {
    zoom?: number;
    center?: [number, number];
    viewMode?: '2D' | '3D';
    resizeEnable?: boolean;
  }

  interface MarkerOptions {
    position?: [number, number];
    title?: string;
    label?: {
      content: string;
      direction: string;
    };
    animation?: 'AMAP_ANIMATION_NONE' | 'AMAP_ANIMATION_DROP' | 'AMAP_ANIMATION_BOUNCE';
  }

  interface PolylineOptions {
    path: [number, number][];
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
    showDir?: boolean;
    isOutline?: boolean;
    outlineColor?: string;
  }
}

interface Window {
  AMap: typeof AMap;
} 