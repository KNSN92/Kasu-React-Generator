export interface KasuBaseConfig {
  // 背景色
  bg_color: string;
}

export interface KasuCenterObject {
  src: HTMLOrSVGImageElement;

  // キャンバスサイズを1としたときの画像サイズ
  scale: number;

  // 回転速度(秒)
  rot_speed: number;
}

export interface KasuAroundObject {
  src: HTMLOrSVGImageElement;

  // 複製数
  count: number;

  // キャンバスサイズを1としたときの画像サイズ
  scale: number;

  // 周辺周回速度(秒)
  move_speed: number;

  // 周辺周回半径(キャンバスサイズを1としたときの値)
  move_radius?: number;

  // 楕円率の変動速度(秒)
  ellipse_ratio_speed?: number;

  // 周辺周回楕円角度(度数法)
  move_angle?: number;

  // 回転速度(秒)
  rot_speed: number;
}

const RAD360 = Math.PI * 2;

export function drawKasu(
  ctx: CanvasRenderingContext2D,
  size: number,
  seconds: number,
  baseConfig?: KasuBaseConfig,
  centerObj?: KasuCenterObject | null,
  around1Obj?: KasuAroundObject | null,
  around2Obj?: KasuAroundObject | null,
) {
  if (baseConfig) {
    drawBase(ctx, size, baseConfig);
  }
  if (centerObj && centerObj.src) {
    drawCenterObject(ctx, centerObj, size, seconds);
  }
  if (around1Obj && around1Obj.src) {
    drawAroundObject(ctx, around1Obj, size, seconds, "clockwise");
  }
  if (around2Obj && around2Obj.src) {
    drawAroundObject(ctx, around2Obj, size, seconds, "anticlockwise");
  }
}

function drawBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  baseConfig: KasuBaseConfig,
) {
  ctx.fillStyle = baseConfig.bg_color;
  ctx.fillRect(0, 0, size, size);
}

function drawCenterObject(
  ctx: CanvasRenderingContext2D,
  centerObj: KasuCenterObject,
  size: number,
  seconds: number,
) {
  const aspect =
    getImgSize(centerObj.src.width) / getImgSize(centerObj.src.height);
  let img_width;
  let img_height;
  if (aspect >= 1) {
    img_width = size * centerObj.scale;
    img_height = (size * centerObj.scale) / aspect;
  } else {
    img_width = size * centerObj.scale * aspect;
    img_height = size * centerObj.scale;
  }
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(RAD360 * (seconds / centerObj.rot_speed));
  ctx.drawImage(
    centerObj.src,
    img_width / -2,
    img_height / -2,
    img_width,
    img_height,
  );
  ctx.restore();
}

function drawAroundObject(
  ctx: CanvasRenderingContext2D,
  aroundObj: KasuAroundObject,
  size: number,
  seconds: number,
  direction: "clockwise" | "anticlockwise" = "clockwise",
) {
  const aspect =
    getImgSize(aroundObj.src.width) / getImgSize(aroundObj.src.height);
  let img_width;
  let img_height;
  if (aspect >= 1) {
    img_width = size * aroundObj.scale;
    img_height = (size * aroundObj.scale) / aspect;
  } else {
    img_width = size * aroundObj.scale * aspect;
    img_height = size * aroundObj.scale;
  }
  const radius = (aroundObj.move_radius ?? 0.4) * size; /* デフォルト0.4 */
  const ellipse_ratio =
    aroundObj.ellipse_ratio_speed === 0
      ? 0.75
      : (RAD360 * seconds) / (aroundObj.ellipse_ratio_speed ?? 0.5) / 2;
  const angle = deg2rad(aroundObj.move_angle ?? 0);
  const dir_multiplier = direction === "clockwise" ? -1 : 1;
  for (let i = 0; i < aroundObj.count; i++) {
    const raw_move_x =
      (Math.sin(
        (aroundObj.move_speed === 0
          ? 0
          : (RAD360 * seconds) / aroundObj.move_speed) *
          dir_multiplier +
          (RAD360 / aroundObj.count) * i,
      ) *
        radius *
        Math.sin(ellipse_ratio)) /
      Math.abs(Math.cos(angle));
    const raw_move_y =
      (Math.cos(
        (aroundObj.move_speed === 0
          ? 0
          : (RAD360 * seconds) / aroundObj.move_speed) *
          dir_multiplier +
          (RAD360 / aroundObj.count) * i,
      ) *
        radius *
        Math.cos(ellipse_ratio)) /
      Math.abs(Math.cos(angle));
    const move_x = raw_move_x * Math.cos(angle) - raw_move_y * Math.sin(angle);
    const move_y = raw_move_x * Math.sin(angle) + raw_move_y * Math.cos(angle);

    ctx.save();
    ctx.translate(size / 2 + move_x, size / 2 + move_y);
    ctx.rotate(RAD360 * (seconds / aroundObj.rot_speed));
    ctx.drawImage(
      aroundObj.src,
      img_width / -2,
      img_height / -2,
      img_width,
      img_height,
    );
    ctx.restore();
  }
}

function getImgSize(size: number | SVGAnimatedLength) {
  if (typeof size === "number") {
    return size;
  } else {
    return size.animVal.value;
  }
}

function deg2rad(deg: number) {
  return (deg / 180) * Math.PI;
}
