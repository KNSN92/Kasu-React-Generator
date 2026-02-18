import type { KasuBaseConfig } from "@/lib/kasu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export function KasuBaseEditor({
  baseConfig,
  setBaseConfig,
  name,
  exporting = false,
}: {
  baseConfig: KasuBaseConfig;
  setBaseConfig: (config: KasuBaseConfig) => void;
  name: string;
  exporting?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="bgColor" className="text-nowrap">
            背景色の設定
          </FieldLabel>
          <Input
            type="color"
            id="bgColor"
            value={baseConfig.bg_color}
            onChange={(e) => {
              setBaseConfig({ ...baseConfig, bg_color: e.target.value });
            }}
            disabled={exporting}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
