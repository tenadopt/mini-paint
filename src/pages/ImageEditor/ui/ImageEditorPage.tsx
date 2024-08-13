import React, { useState, useEffect, useRef, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useForm, SubmitHandler, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    doc,
    getDoc,
    addDoc,
    updateDoc,
    collection,
    DocumentReference,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { toast } from "react-toastify";
import CanvasEditor, {
    CanvasEditorHandle,
} from "features/imageEditor/ui/CanvasEditor";
import { useAppSelector } from "shared/hooks/hooks";

const workSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().optional(),
});

type WorkFormValues = z.infer<typeof workSchema>;

interface Work extends WorkFormValues {
    userId: string;
}

const ImageEditorPage = memo(() => {
    const { workId } = useParams<{ workId: string }>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<WorkFormValues>({
        resolver: zodResolver(workSchema),
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [loadImage, setLoadImage] = useState<boolean>(false);
    const canvasEditorRef = useRef<CanvasEditorHandle | null>(null);
    const userId = useAppSelector((state) => state.auth.userId);

    useEffect(() => {
        const loadWork = async () => {
            if (!workId) {
                setValue("title", "");
                setValue("description", "");
                setImageUrl("");
                setLoadImage(false);
                canvasEditorRef.current?.clearCanvas();
                setLoading(false);

                return;
            }

            setLoading(true);

            try {
                const docRef: DocumentReference = doc(db, "works", workId);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    toast.error("Work not found");
                    setLoading(false);

                    return;
                }

                const work = docSnap.data() as Work;

                if (work.userId !== userId) {
                    toast.error("Work not found or you do not have access");
                    setLoading(false);
                    
                    return;
                }

                const { title, description, imageUrl } = work;

                setValue("title", title);
                setValue("description", description);
                setValue("imageUrl", imageUrl || "");
                setImageUrl(imageUrl || "");
                setLoadImage(true);
            } catch (err) {
                toast.error("Failed to load work");
                setError("Failed to load work");
            } finally {
                setLoading(false);
            }
        };

        loadWork();
    }, [workId, userId, setValue]);

    const onSubmit: SubmitHandler<WorkFormValues> = async (data) => {
        setLoading(true);
        try {
            if (canvasEditorRef.current) {
                const imageUrl = await canvasEditorRef.current.saveCanvas();

                data.imageUrl = imageUrl;
            }

            if (workId) {
                const docRef: DocumentReference = doc(db, "works", workId);

                await updateDoc(docRef, data);
                toast.success("Work updated successfully");
            } else {
                const worksCollection = collection(db, "works");

                await addDoc(worksCollection, { ...data, userId });
                toast.success("Work added successfully");
            }

            navigate("/");
        } catch (err) {
            setError("Failed to save work");
            toast.error("Failed to save work");
        } finally {
            setLoading(false);
        }
    };

    const handleClearCanvas = () => {
        canvasEditorRef.current?.clearCanvas();
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                {workId ? "Edit Work" : "Create New Work"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    {...register("title" as FieldPath<WorkFormValues>)}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    {...register("description" as FieldPath<WorkFormValues>)}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : workId ? "Update Work" : "Create Work"}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClearCanvas}
                >
                    Clear Canvas
                </Button>
            </Box>
            <Box mt={4}>
                <CanvasEditor
                    ref={canvasEditorRef}
                    imageUrl={imageUrl}
                    onSave={setImageUrl}
                    loadImage={loadImage}
                />
            </Box>
        </Container>
    );
});

export default ImageEditorPage;