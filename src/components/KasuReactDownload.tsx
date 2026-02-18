import {
  drawKasu,
  type KasuAroundObject,
  type KasuBaseConfig,
  type KasuCenterObject,
} from "@/lib/kasu";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

import {
  BufferTarget,
  CanvasSource,
  Output as MediaOutput,
  Mp4OutputFormat,
  OutputFormat,
  QUALITY_MEDIUM,
  WebMOutputFormat,
} from "mediabunny";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Progress } from "./ui/progress";

export type VideoFormat = "video/mp4" | "video/webm";

const VideoFormat2Ext: Record<VideoFormat, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

type Codec = "avc" | "vp9" | "hevc" | "av1" | "vp8";

const VideoFormat2Codec: Record<VideoFormat, Codec> = {
  "video/mp4": "avc",
  "video/webm": "vp9",
};

export interface VideoExportOptions {
  durationSec: number;
  fps: number;
  size: number;
  format: VideoFormat;
}

export function KasuReactDownload({
  exporting,
  startExport,
  baseConfig,
  centerObj,
  around1Obj,
  around2Obj,
}: {
  exporting: boolean;
  startExport: (exportFunc: () => Promise<void>) => void;
  baseConfig: KasuBaseConfig;
  centerObj: KasuCenterObject | undefined;
  around1Obj: KasuAroundObject | undefined;
  around2Obj: KasuAroundObject | undefined;
}) {
  const [videoExportOptions, setVideoExportOptions] =
    useState<VideoExportOptions>({
      durationSec: 10,
      fps: 30,
      size: 2048,
      format: "video/mp4",
    });
  const [exportingProgress, setExportingProgress] = useState<{
    total: number;
    progress: number;
  } | null>(null);
  return (
    <>
      <DownloadingDialog
        opening={exporting}
        total={exportingProgress?.total ?? 0}
        progress={exportingProgress?.progress ?? 0}
      />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ダウンロード</CardTitle>
          <CardDescription>動画やGIFとしてダウンロード</CardDescription>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="durationSec" className="text-nowrap w-20">
              秒数 ({videoExportOptions.durationSec}秒)
            </FieldLabel>
            <Input
              type="range"
              id="durationSec"
              min={0}
              max={60}
              step={0.1}
              value={videoExportOptions.durationSec}
              onChange={(e) => {
                setVideoExportOptions({
                  ...videoExportOptions,
                  durationSec: parseFloat(e.target.value),
                });
              }}
              disabled={exporting}
            />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="fps" className="text-nowrap w-20">
              fps ({videoExportOptions.fps}fps)
            </FieldLabel>
            <Input
              type="range"
              id="fps"
              min={1}
              max={60}
              step={1}
              value={videoExportOptions.fps}
              onChange={(e) => {
                setVideoExportOptions({
                  ...videoExportOptions,
                  fps: parseInt(e.target.value),
                });
              }}
              disabled={exporting}
            />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="size" className="text-nowrap">
              サイズ (px)
            </FieldLabel>
            <Input
              type="number"
              id="size"
              min={64}
              max={3072}
              step={1}
              value={videoExportOptions.size}
              onChange={(e) => {
                setVideoExportOptions({
                  ...videoExportOptions,
                  size: parseInt(e.target.value),
                });
              }}
              disabled={exporting}
            />
          </Field>
          <Field className="mt-2" orientation="horizontal">
            <FieldLabel className="text-nowrap w-fit">
              動画フォーマット
            </FieldLabel>
            <Select
              value={videoExportOptions.format}
              onValueChange={(value) => {
                console.log("Selected format:", value);
                setVideoExportOptions({
                  ...videoExportOptions,
                  format: value as VideoFormat,
                });
              }}
              disabled={exporting}
            >
              <SelectTrigger>
                <SelectValue placeholder="動画フォーマットを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="video/mp4">MP4</SelectItem>
                  <SelectItem value="video/webm">WebM</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Button
            onClick={() =>
              startExport(async () => {
                try {
                  await downloadKasuReactVideo(
                    videoExportOptions.size,
                    videoExportOptions.durationSec,
                    videoExportOptions.fps,
                    videoExportOptions.format,
                    baseConfig,
                    centerObj,
                    around1Obj,
                    around2Obj,
                    setExportingProgress,
                  );
                } catch (e) {
                  console.error(e);
                }
              })
            }
            disabled={exporting}
            className="mt-4 cursor-pointer"
          >
            ダウンロード
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

interface DownloadingDialogProps {
  opening: boolean;
  total: number;
  progress: number;
}

function DownloadingDialog({
  opening,
  total,
  progress,
}: DownloadingDialogProps) {
  const progressStr =
    total > 0 ? `${((progress / total) * 100).toPrecision(3)}%` : "0.0%";
  const progressValue = Math.round(total > 0 ? (progress / total) * 100 : 0);
  return (
    <Dialog open={opening}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>動画を生成中...</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>
            <span>動画を生成中...</span>
            <span className="ml-auto">{progressStr}</span>
          </FieldLabel>
          <Progress value={progressValue} className="transition-none" />
        </Field>
      </DialogContent>
    </Dialog>
  );
}

async function downloadKasuReactVideo(
  size: number,
  durationSec: number,
  fps: number,
  format: VideoFormat,
  baseConfig: KasuBaseConfig,
  centerObj: KasuCenterObject | undefined,
  around1Obj: KasuAroundObject | undefined,
  around2Obj: KasuAroundObject | undefined,
  setExportingProgress?: (progress: {
    total: number;
    progress: number;
  }) => void,
) {
  size = Math.min(3072, Math.max(64, size));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx == null) throw new Error("Failed to get 2D context");

  let outputFormat: OutputFormat;
  switch (format) {
    case "video/mp4":
      outputFormat = new Mp4OutputFormat();
      break;
    case "video/webm":
      outputFormat = new WebMOutputFormat();
      break;
    default:
      throw new Error("Unsupported format: " + format);
  }

  const output = new MediaOutput({
    format: outputFormat,
    target: new BufferTarget(),
  });
  const canvasSource = new CanvasSource(canvas, {
    codec: VideoFormat2Codec[format],
    latencyMode: "quality",
    bitrate: QUALITY_MEDIUM,
  });
  output.addVideoTrack(canvasSource);

  const totalFrames = Math.floor(durationSec * fps);
  const intervalMs = 1000 / fps;

  try {
    await output.start();
    for (let frame = 0; frame < totalFrames; frame++) {
      const seconds = (frame * intervalMs) / 1000;
      ctx.clearRect(0, 0, size, size);
      drawKasu(
        ctx,
        size,
        seconds,
        baseConfig,
        centerObj,
        around1Obj,
        around2Obj,
      );
      await canvasSource.add(seconds);
      if (setExportingProgress) {
        console.log(`Exporting video: frame ${frame + 1} / ${totalFrames}`);
        setExportingProgress({ total: totalFrames, progress: frame + 1 });
      }
    }
    await output.finalize();
  } catch (e) {
    console.error(e);
  }

  const buf = output.target.buffer ?? undefined;
  const blob = new Blob(buf && [buf], {
    type: format,
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kasu_react_video.${VideoFormat2Ext[format]}`;
  a.click();
  URL.revokeObjectURL(url);
}
