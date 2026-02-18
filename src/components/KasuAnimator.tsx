import {
  drawKasu,
  type KasuAroundObject,
  type KasuBaseConfig,
  type KasuCenterObject,
} from "@/lib/kasu";
import { useEffect, useRef } from "react";

interface Props {
  baseConfig?: KasuBaseConfig;
  centerObj?: KasuCenterObject;
  around1Obj?: KasuAroundObject;
  around2Obj?: KasuAroundObject;
  setFps?: (fps: number) => void;
  fpsRefreshSec?: number;
  className?: string;
}

export function KasuAnimator({
  baseConfig,
  centerObj,
  around1Obj,
  around2Obj,
  setFps,
  fpsRefreshSec = 0.5,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animateFuncRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const prevFpsRef = useRef<number>(0);
  const fpsRefreshedRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current!;
    let size = 0;
    const onResize = () => {
      size =
        Math.min(canvas.clientWidth, canvas.clientHeight) * devicePixelRatio;
      canvas.height = size;
      canvas.width = size;
      const parent = canvas.parentElement;
      if (parent) {
        if (parent.clientWidth > parent.clientHeight) {
          canvas.style.width = "auto";
          canvas.style.height = `100%`;
        } else {
          canvas.style.width = `100%`;
          canvas.style.height = "auto";
        }
      }
    };
    addEventListener("resize", onResize);
    onResize();

    // まだnullかも知れないけど、animate関数内でnullチェックするのは面倒なのでここでnullを除外しておく。結局このあとifでnullチェックするから安全
    const ctx = canvas.getContext("2d")!;
    if (ctx == null) throw new Error("Failed to get 2D context");

    animateFuncRef.current = animate;
    function animate() {
      const now = Date.now();
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
        fpsRefreshedRef.current = now;
      }
      const elapsed = now - startTimeRef.current!;
      if (setFps) {
        const frameTime = now - (prevTimeRef.current ?? now);
        const currentFps =
          (prevFpsRef.current + (frameTime > 0 ? 1000 / frameTime : 0)) / 2;
        if (now - fpsRefreshedRef.current >= fpsRefreshSec * 1000) {
          fpsRefreshedRef.current = now;
          setFps(currentFps);
        }
        prevTimeRef.current = now;
        prevFpsRef.current = currentFps;
      }
      const seconds = elapsed / 1000; // 秒単位

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawKasu(
        ctx,
        size,
        seconds,
        baseConfig,
        centerObj,
        around1Obj,
        around2Obj,
      );

      if (animateFuncRef.current == animate) {
        requestAnimationFrame(animate);
      }
    }
    animate();

    return () => {
      removeEventListener("resize", onResize);
    };
  }, [baseConfig, centerObj, around1Obj, around2Obj, setFps, fpsRefreshSec]);

  return (
    <canvas
      ref={canvasRef}
      width={0}
      height={0}
      style={{ aspectRatio: "1 / 1" }}
      className={className}
    />
  );
}
