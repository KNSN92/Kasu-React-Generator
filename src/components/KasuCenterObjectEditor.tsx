import type { KasuCenterObject } from "@/lib/kasu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export type KasuCenterObjectState = Required<Omit<KasuCenterObject, "src">> & {
  src: HTMLOrSVGImageElement | null;
};

export function KasuCenterObjectEditor({
  centerObj,
  setCenterObj,
  name,
  exporting = false,
}: {
  centerObj: KasuCenterObjectState;
  setCenterObj: (obj: KasuCenterObjectState) => void;
  name: string;
  exporting?: boolean;
}) {
  const disabled = exporting || centerObj.src == null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>ただ回っているだけの{name}の設定</CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="mb-8">
          <FieldLabel htmlFor="centerImg">{name}の画像</FieldLabel>
          <Input
            type="file"
            id="centerImg"
            accept="image/png, image/jpeg, image/svg+xml"
            disabled={exporting}
            className="cursor-pointer"
            onChange={(e) => {
              setKasuObjStateImgFromInput(e, centerObj, setCenterObj);
            }}
          />
          <FieldDescription>{name}の画像を選択してください</FieldDescription>
        </Field>
        <Field className="grid grid-cols-[160px_1fr] gap-0">
          <FieldLabel htmlFor="centerScale" className="text-nowrap mr-3">
            スケール ({centerObj.scale})
          </FieldLabel>
          <Input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={centerObj.scale}
            onChange={(e) =>
              setCenterObj({
                ...centerObj,
                scale: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel htmlFor="centerRotSpeed" className="text-nowrap mr-3">
            回転速度(秒) ({centerObj.rot_speed}秒)
          </FieldLabel>
          <Input
            type="range"
            min={0}
            max={60}
            step={0.01}
            value={centerObj.rot_speed}
            onChange={(e) =>
              setCenterObj({
                ...centerObj,
                rot_speed: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
        </Field>
      </CardContent>
    </Card>
  );
}

function setKasuObjStateImgFromInput(
  e: React.ChangeEvent<HTMLInputElement>,
  prevObj: KasuCenterObjectState,
  setObj: (obj: KasuCenterObjectState) => void,
) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  if (file) {
    if (prevObj.src instanceof HTMLImageElement) {
      URL.revokeObjectURL(prevObj.src.src);
    }
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setObj({ ...prevObj, src: img });
    };
  }
}
