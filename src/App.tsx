import { useEffect, useRef, useState, useTransition } from "react";
import { KasuAnimator } from "./components/KasuAnimator";
import { Card, CardContent } from "./components/ui/card";
import {
  type KasuAroundObject,
  type KasuBaseConfig,
  type KasuCenterObject,
} from "./lib/kasu";
import {
  KasuAroundObjectEditor,
  type KasuAroundObjectState,
} from "./components/KasuAroundObjectEditor";
import {
  KasuCenterObjectEditor,
  type KasuCenterObjectState,
} from "./components/KasuCenterObjectEditor";
import { KasuReactDownload } from "./components/KasuReactDownload";
import { KasuBaseEditor } from "./components/KasuBaseEditor";

export function App() {
  const [baseConfig, setBaseConfig] = useState<KasuBaseConfig>({
    bg_color: "#000000",
  });
  const [centerObj, setCenterObj] = useState<KasuCenterObjectState>({
    src: null,
    rot_speed: 1,
    scale: 0.25,
  });
  const [around1Obj, setAround1Obj] = useState<KasuAroundObjectState>({
    src: null,
    count: 20,
    move_speed: 5,
    move_radius: 0.5,
    ellipse_ratio_speed: 10,
    move_angle: 45,
    rot_speed: 1,
    scale: 0.1,
  });
  const [around2Obj, setAround2Obj] = useState<KasuAroundObjectState>({
    src: null,
    count: 20,
    move_speed: 5,
    move_radius: 0.5,
    ellipse_ratio_speed: 10,
    move_angle: -45,
    rot_speed: 1,
    scale: 0.1,
  });
  const [fps, setFps] = useState<number>(0);

  const [exporting, startExport] = useTransition();

  const openHandsRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    function resizeOpenHands() {
      const openHands = openHandsRef.current;
      if (!openHands) return;
      openHands.textContent = "👐";
      while (openHands.offsetWidth < window.innerWidth) {
        openHands.textContent += " 👐";
      }
    }
    resizeOpenHands();
    addEventListener("resize", resizeOpenHands);
    return () => {
      removeEventListener("resize", resizeOpenHands);
    };
  }, []);

  return (
    <div className="px-8 size-full overflow-hidden flex flex-col items-center">
      <div className="md:hidden fixed inset-0 w-screen h-fit z-10 py-2 px-4 opacity-95">
        <Card>
          <CardContent>
            まだ小さな画面のレスポンシブ対応調整中でKasuだよ。ゴメーンネ♪
          </CardContent>
        </Card>
      </div>
      <header className="w-full mt-8 flex justify-between">
        <div className="flex items-center">
          <img
            src="/icon.svg"
            alt="Kasu React Generator Icon"
            className="inline w-16 mr-2"
          />
          <h1 className="text-5xl text-black dark:text-foreground font-bold">
            Kasu React Generator (???)
          </h1>
        </div>
        <div>
          <span className="text-xl text-foreground">© 2026 KNSN92</span>
        </div>
      </header>
      <span
        ref={openHandsRef}
        className="text-5xl text-nowrap text-center w-fit mt-8"
      >
        👐
      </span>
      <main className="grow w-full mt-8 overflow-hidden md:grid md:grid-cols-2 md:grid-rows-1 not-md:grid-cols-1 not-md:grid-rows-2 gap-8">
        <div className="size-auto max-h-full md:order-1 grid grid-rows-[auto_1fr_auto] gap-4">
          <span className="text-[#0f0] text-2xl">{fps.toFixed(1)}FPS</span>
          <div className="grow size-full overflow-hidden">
            <KasuAnimator
              baseConfig={baseConfig}
              centerObj={
                centerObj.src != null
                  ? (centerObj as KasuCenterObject)
                  : undefined
              }
              around1Obj={
                around1Obj.src != null
                  ? (around1Obj as KasuAroundObject)
                  : undefined
              }
              around2Obj={
                around2Obj.src != null
                  ? (around2Obj as KasuAroundObject)
                  : undefined
              }
              setFps={setFps}
              className="border border-border"
            />
          </div>
          <KasuReactDownload
            exporting={exporting}
            startExport={startExport}
            baseConfig={baseConfig}
            centerObj={
              centerObj.src != null
                ? (centerObj as KasuCenterObject)
                : undefined
            }
            around1Obj={
              around1Obj.src != null
                ? (around1Obj as KasuAroundObject)
                : undefined
            }
            around2Obj={
              around2Obj.src != null
                ? (around2Obj as KasuAroundObject)
                : undefined
            }
          />
        </div>
        <div className="overflow-y-scroll max-h-full md:order-0 flex flex-col gap-2">
          <KasuBaseEditor
            baseConfig={baseConfig}
            setBaseConfig={setBaseConfig}
            name="基本設定"
            exporting={exporting}
          />
          <KasuCenterObjectEditor
            centerObj={centerObj}
            setCenterObj={setCenterObj}
            name="中心のオブジェクト"
            exporting={exporting}
          />
          <KasuAroundObjectEditor
            aroundObj={around1Obj}
            setAroundObj={setAround1Obj}
            name="周辺のオブジェクト1"
            exporting={exporting}
          />
          <KasuAroundObjectEditor
            aroundObj={around2Obj}
            setAroundObj={setAround2Obj}
            name="周辺のオブジェクト2"
            exporting={exporting}
          />
        </div>
      </main>
    </div>
  );
}
