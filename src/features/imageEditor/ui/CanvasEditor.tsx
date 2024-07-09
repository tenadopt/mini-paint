import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store';
import {
    Button, Slider, TextField, Container, Box, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent,
} from '@mui/material';
import { setBrushSizeWithState, setColorWithState } from 'features/imageEditor/model/imageEditorSlice';

type ShapeType = 'line' | 'star' | 'polygon' | 'circle' | 'rectangle';

const CanvasEditor: React.FC = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.imageEditor.settings);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [shape, setShape] = useState<ShapeType>('line');
    const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);

    const [brushSize, setBrushSizeState] = useState<number>(settings.brushSize);
    const [color, setColorState] = useState<string>(settings.color);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        canvas.style.width = `${window.innerWidth * 0.8}px`;
        canvas.style.height = `${window.innerHeight * 0.8}px`;

        const context = canvas.getContext('2d');
        if (!context) return;
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
    }, [brushSize, color]);

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
        if (shape === 'star') {
            drawStar(startPosition.x, startPosition.y, offsetX, offsetY);
        } else if (shape === 'polygon') {
            drawPolygon(startPosition.x, startPosition.y, offsetX, offsetY, 5);
        } else if (shape === 'circle') {
            drawCircle(startPosition.x, startPosition.y, offsetX, offsetY);
        } else if (shape === 'rectangle') {
            drawRectangle(startPosition.x, startPosition.y, offsetX, offsetY);
        }
        setIsDrawing(false);
        setStartPosition(null);
        contextRef.current?.closePath();
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || shape !== 'line') return;
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
        }
    };

    const drawStar = (cx: number, cy: number, outerX: number, outerY: number) => {
        const context = contextRef.current;
        if (!context) return;

        const spikes = 5;
        const outerRadius = Math.sqrt((outerX - cx) ** 2 + (outerY - cy) ** 2);
        const innerRadius = outerRadius / 2.5;
        let rotation = Math.PI / 2 * 3;
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

    const drawPolygon = (x1: number, y1: number, x2: number, y2: number, sides: number) => {
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

    const handleBrushSizeChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setBrushSizeState(newValue);
            dispatch(setBrushSizeWithState({ brushSize: newValue }));
        }
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColorState(event.target.value);
        dispatch(setColorWithState({ color: event.target.value }));
    };

    const handleShapeChange = (event: SelectChangeEvent<string>) => {
        setShape(event.target.value as ShapeType);
    };

    return (
        <Container>
            <Box display="flex" mt={2}>
                <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel>Shape</InputLabel>
                    <Select<ShapeType>
                        value={shape}
                        onChange={handleShapeChange}
                        label="Shape"
                    >
                        <MenuItem value="line">Line</MenuItem>
                        <MenuItem value="star">Star</MenuItem>
                        <MenuItem value="polygon">Polygon</MenuItem>
                        <MenuItem value="circle">Circle</MenuItem>
                        <MenuItem value="rectangle">Rectangle</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    label="Brush Color"
                    variant="outlined"
                    margin="normal"
                />
                <Slider
                    value={brushSize}
                    onChange={(_, newValue) => handleBrushSizeChange(_, newValue)}
                    min={1}
                    max={50}
                    valueLabelDisplay="auto"
                    style={{ width: 200, margin: '0 20px' }}
                />
                <Button variant="contained" color="primary" onClick={clearCanvas}>
                    Clear Canvas
                </Button>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onMouseLeave={finishDrawing}
                    style={{ border: '1px solid #000' }}
                />
            </Box>
        </Container>
    );
};

export default CanvasEditor;