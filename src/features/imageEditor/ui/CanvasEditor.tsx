import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "./CanvasEditor.css";
import BrushSizeSlider from "shared/ui/BrushSizeSlider";
import ColorPicker from "shared/ui/ColorPicker";
import ShapeSelector from "shared/ui/ShapeSelector";
import { useSaveImage } from "features/imageGallery/api/api";

interface CanvasEditorProps {
  imageUrl?: string;
  onSave: (url: string) => void;
  loadImage: boolean;
}

export interface CanvasEditorHandle {
  getCanvasDataUrl: () => string;
  saveCanvas: () => Promise<string>;
  clearCanvas: () => void;
}

const CanvasEditor = forwardRef<CanvasEditorHandle, CanvasEditorProps>(
  ({ imageUrl, onSave, loadImage }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPosition, setStartPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const saveImageMutation = useSaveImage();
    const imageRef = useRef<HTMLImageElement | null>(null);
    const savedDataRef = useRef<ImageData | null>(null);

    const shape = searchParams.get("shape") || "line";
    const color = searchParams.get("color") || "#000000";
    const brushSize = parseInt(searchParams.get("brushSize") || "5", 10);

    useImperativeHandle(ref, () => ({
      getCanvasDataUrl,
      saveCanvas,
      clearCanvas,
    }));

    const updateCanvasContext = useCallback(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      if (canvas && context) {
        if (savedDataRef.current) {
          context.putImageData(savedDataRef.current, 0, 0);
        }

        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }, [color, brushSize]);

    useEffect(() => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.width = window.innerHeight * 0.8;
      canvas.height = window.innerHeight * 0.8;
      canvas.style.width = `${window.innerHeight * 0.8}px`;
      canvas.style.height = `${window.innerHeight * 0.8}px`;

      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        shape,
        color,
        brushSize: brushSize.toString(),
      });
    }, []);

    useEffect(() => {
      savedDataRef.current =
        contextRef.current?.getImageData(
          0,
          0,
          canvasRef.current?.width || 0,
          canvasRef.current?.height || 0,
        ) ?? null;
      updateCanvasContext();
    }, [color, brushSize, updateCanvasContext]);

    const loadImageToCanvas = useCallback((imageUrl: string) => {
      const canvas = canvasRef.current;
      const context = contextRef.current;

      if (!canvas || !context) return;

      const img = new Image();

      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = () => {
        imageRef.current = img;
        drawImageToFitCanvas(img);
      };
      img.onerror = () => {
        toast.error("Failed to load image");
      };
    }, []);

    useEffect(() => {
      if (loadImage && imageUrl) {
        loadImageToCanvas(imageUrl);
      }
    }, [imageUrl, loadImage, loadImageToCanvas]);

    const drawImageToFitCanvas = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      const context = contextRef.current;

      if (!canvas || !context) return;

      const canvasAspectRatio = canvas.width / canvas.height;
      const imageAspectRatio = img.width / img.height;

      let renderableHeight, renderableWidth, xStart, yStart;

      if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = img.width * (renderableHeight / img.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      } else if (imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = img.height * (renderableWidth / img.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      } else {
        renderableHeight = canvas.height;
        renderableWidth = canvas.width;
        xStart = 0;
        yStart = 0;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    };

    const getCanvasDataUrl = () => {
      return canvasRef.current?.toDataURL() || "";
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const { offsetX, offsetY } = event.nativeEvent;

      setStartPosition({ x: offsetX, y: offsetY });
      setIsDrawing(true);
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
    };

    const finishDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !startPosition) return;

      const { offsetX, offsetY } = event.nativeEvent;

      if (shape === "star") {
        drawStar(startPosition.x, startPosition.y, offsetX, offsetY);
      } else if (shape === "polygon") {
        drawPolygon(startPosition.x, startPosition.y, offsetX, offsetY, 5);
      } else if (shape === "circle") {
        drawCircle(startPosition.x, startPosition.y, offsetX, offsetY);
      } else if (shape === "rectangle") {
        drawRectangle(startPosition.x, startPosition.y, offsetX, offsetY);
      }

      setIsDrawing(false);
      setStartPosition(null);
      contextRef.current?.closePath();

      // Save the canvas state after drawing
      savedDataRef.current =
        contextRef.current?.getImageData(
          0,
          0,
          canvasRef.current?.width || 0,
          canvasRef.current?.height || 0,
        ) ?? null;
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || shape !== "line") return;

      const { offsetX, offsetY } = event.nativeEvent;
      const context = contextRef.current;

      if (context) {
        context.lineTo(offsetX, offsetY);
        context.stroke();
      }
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;

      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        imageRef.current = null;
      }
    };

    const saveCanvas = async () => {
      const canvas = canvasRef.current;

      if (canvas) {
        const dataUrl = canvas.toDataURL();

        try {
          const url = await saveImageMutation.mutateAsync(dataUrl);

          onSave(url);

          return url;
        } catch (error) {
          toast.error("Failed to save canvas image");
          throw error;
        }
      }

      return "";
    };

    const drawStar = (
      cx: number,
      cy: number,
      outerX: number,
      outerY: number,
    ) => {
      const context = contextRef.current;

      if (!context) return;

      const spikes = 5;
      const outerRadius = Math.sqrt((outerX - cx) ** 2 + (outerY - cy) ** 2);
      const innerRadius = outerRadius / 2.5;
      let rotation = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rotation) * outerRadius;
        y = cy + Math.sin(rotation) * outerRadius;
        context.lineTo(x, y);
        rotation += step;

        x = cx + Math.cos(rotation) * innerRadius;
        y = cy + Math.sin(rotation) * innerRadius;
        context.lineTo(x, y);
        rotation += step;
      }

      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.stroke();
    };

    const drawPolygon = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      sides: number,
    ) => {
      const context = contextRef.current;

      if (!context) return;

      const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = (2 * Math.PI) / sides;

      context.beginPath();

      for (let i = 0; i < sides; i++) {
        const x = x1 + radius * Math.cos(angle * i);
        const y = y1 + radius * Math.sin(angle * i);

        context.lineTo(x, y);
      }

      context.closePath();
      context.stroke();
    };

    const drawCircle = (x1: number, y1: number, x2: number, y2: number) => {
      const context = contextRef.current;

      if (!context) return;

      const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

      context.beginPath();
      context.arc(x1, y1, radius, 0, 2 * Math.PI);
      context.stroke();
    };

    const drawRectangle = (x1: number, y1: number, x2: number, y2: number) => {
      const context = contextRef.current;

      if (!context) return;

      const width = x2 - x1;
      const height = y2 - y1;

      context.beginPath();
      context.rect(x1, y1, width, height);
      context.stroke();
    };

    return (
      <Container>
        <ToastContainer />
        <Box className="container-box">
          <ShapeSelector />
          <ColorPicker />
          <BrushSizeSlider />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="canvas"
          />
        </Box>
      </Container>
    );
  },
);

export default CanvasEditor;
