import type { KasuAroundObject } from "@/lib/kasu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export type KasuAroundObjectState = Required<Omit<KasuAroundObject, "src">> & {
  src: HTMLOrSVGImageElement | null;
};

export function KasuAroundObjectEditor({
  aroundObj,
  setAroundObj,
  name,
  exporting = false,
}: {
  aroundObj: KasuAroundObjectState;
  setAroundObj: (obj: KasuAroundObjectState) => void;
  name: string;
  exporting?: boolean;
}) {
  const disabled = exporting || aroundObj.src == null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>周辺を周回している{name}の設定</CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="mb-8">
          <FieldLabel htmlFor="around1Img" className="text-nowrap">
            {name}の画像
          </FieldLabel>
          <Input
            type="file"
            id="around1Img"
            accept="image/png, image/jpeg, image/svg+xml"
            disabled={exporting}
            className="cursor-pointer"
            onChange={(e) =>
              setKasuObjStateImgFromInput(e, aroundObj, setAroundObj)
            }
          />
          <FieldDescription>{name}の画像を選択してください</FieldDescription>
        </Field>
        <Field className="grid grid-cols-[196px_1fr] gap-0">
          <FieldLabel htmlFor="aroundCount" className="text-nowrap mr-3">
            オブジェクト数 ({aroundObj.count}個)
          </FieldLabel>
          <Input
            type="number"
            id="aroundCount"
            min={1}
            max={100}
            value={aroundObj.count}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
                count: parseInt(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel htmlFor="aroundScale" className="text-nowrap mr-3">
            スケール ({aroundObj.scale})
          </FieldLabel>
          <Input
            type="range"
            id="aroundScale"
            min={0}
            max={1}
            step={0.01}
            value={aroundObj.scale}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
                scale: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel htmlFor="aroundMoveSpeed" className="text-nowrap mr-3">
            周回速度(秒) ({aroundObj.move_speed}秒)
          </FieldLabel>
          <Input
            type="range"
            id="aroundMoveSpeed"
            min={0}
            max={60}
            step={0.01}
            value={aroundObj.move_speed}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
                move_speed: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel htmlFor="aroundMoveRadius" className="text-nowrap mr-3">
            周回半径 ({aroundObj.move_radius})
          </FieldLabel>
          <Input
            type="range"
            id="aroundMoveRadius"
            min={0}
            max={1}
            step={0.01}
            value={aroundObj.move_radius}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
                move_radius: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel
            htmlFor="aroundEllipseRatioSpeed"
            className="text-nowrap mr-3"
          >
            楕円率変動速度(秒) ({aroundObj.ellipse_ratio_speed}秒)
          </FieldLabel>
          <Input
            type="range"
            id="aroundEllipseRatioSpeed"
            min={0}
            max={60}
            step={0.01}
            value={aroundObj.ellipse_ratio_speed}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
                ellipse_ratio_speed: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel htmlFor="aroundMoveAngle" className="text-nowrap mr-3">
            周回楕円角度 ({aroundObj.move_angle}度)
          </FieldLabel>
          <Input
            type="range"
            id="aroundMoveAngle"
            min={-45}
            max={45}
            step={1}
            value={aroundObj.move_angle}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
                move_angle: parseFloat(e.target.value),
              })
            }
            disabled={disabled}
          />
          <FieldLabel htmlFor="aroundRotSpeed" className="text-nowrap mr-3">
            回転速度(秒) ({aroundObj.rot_speed}秒)
          </FieldLabel>
          <Input
            type="range"
            id="aroundRotSpeed"
            min={0}
            max={60}
            step={0.01}
            value={aroundObj.rot_speed}
            onChange={(e) =>
              setAroundObj({
                ...aroundObj,
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
  prevObj: KasuAroundObjectState,
  setObj: (obj: KasuAroundObjectState) => void,
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
