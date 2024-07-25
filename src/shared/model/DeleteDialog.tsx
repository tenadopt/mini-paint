import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteDialog = ({ open, onClose, onDelete }: DeleteDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Work</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this work? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={onDelete} color="secondary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDialog;