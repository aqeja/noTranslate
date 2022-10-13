import React, { useEffect, useRef, useState } from "react";
import { Error } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
export const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rounded = 5,
  fill = false,
  stroke = true,
) {
  const radius = { tl: rounded, tr: rounded, br: rounded, bl: rounded };

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
const RetinaCanvas = React.forwardRef<HTMLCanvasElement, React.CanvasHTMLAttributes<HTMLCanvasElement>>(
  (props, ref) => {
    return <canvas ref={ref} {...props}></canvas>;
  },
);

const PER_WIDTH = 4;
const ITEM_GAP = 3;
const CANVAS_WIDTH = 16 * (PER_WIDTH + ITEM_GAP) - ITEM_GAP;
const CANVAS_HEIGHT = 14;
const MIN_HEIGHT = 2;
type VolumeIndicatorProps = {
  dataGetter: () => number[];
  messsage?: string;
};
const VolumeIndicatorBody: React.FC<VolumeIndicatorProps> = ({
  dataGetter,
  messsage = "麦克风工作不正常，其他人可能无法听到你的声音",
}) => {
  // const studio = useStudio();
  const elRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = elRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.devicePixelRatio > 1) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  useEffect(() => {
    const ctx = elRef.current?.getContext("2d");
    let id = -1;

    if (!ctx) return;
    const render = (data: number[]) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      for (let i = 0; i < 16; i++) {
        const v = data[i] === 0 ? MIN_HEIGHT : Math.max(data[i] * (CANVAS_HEIGHT / 2) + CANVAS_HEIGHT / 2, MIN_HEIGHT);
        // ctx.fillStyle = "rgba(71, 181, 255, 1)";
        ctx.fillStyle = "rgba(127, 127, 127, 1)";
        roundRect(ctx, i * (ITEM_GAP + PER_WIDTH), (CANVAS_HEIGHT - v) / 2, PER_WIDTH, v, 2, true, false);
      }
    };
    const onFrame = () => {
      const data = dataGetter();
      render(data);
      id = window.requestAnimationFrame(onFrame);
    };
    id = window.requestAnimationFrame(onFrame);
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [dataGetter]);
  const [delayVisible, setDelayVisible] = useState(false);
  useEffect(() => {
    let alive = true;
    const delay = () => {
      if (alive) {
        setDelayVisible(true);
      }
    };
    const id = setTimeout(delay, 1000);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, []);
  const isMicphoneAvaliable = true;
  return (
    <>
      {!isMicphoneAvaliable && delayVisible && (
        <Tooltip title={messsage}>
          <Error
            color="error"
            style={{
              fontSize: 16,
            }}
            sx={{ mr: 1 }}
          />
        </Tooltip>
      )}
      <RetinaCanvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={elRef} />
    </>
  );
};

const avaliable = !isSafari();
const VolumeIndicator: React.FC<VolumeIndicatorProps> = (props) => {
  if (!avaliable) return null;
  return <VolumeIndicatorBody {...props} />;
};
export default VolumeIndicator;
