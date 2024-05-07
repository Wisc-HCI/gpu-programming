import React from "react";
import {
  Dialog,
  Box,
  Button,
  Card,
  CardContent
} from "@mui/material";
import useStore from "../Store";
import FileSaver from 'file-saver';

const DialogContent = () => {
    const closeModal = useStore((store) => store.closeModal);

    const handleDownload = () =>{
        var blob = new Blob([activityLog], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "activity log.txt");
    }
        
    return (
        <Card sx={{ padding: 0 }}>
        <CardContent
            sx={{
            flexDirection: "row",
            display: "flex",
            padding: 0,
            margin: 0,
            }}
        >
            <Box
            sx={{
                overflowY: "scroll",
                maxHeight: "70vh",
                width: "50vw",
            }}
            >
                <Button onClick={handleDownload}>
                    Download     
                </Button>
                <Button onClick={closeModal}>Close</Button>
            </Box>
        </CardContent>
        </Card>
    );
};

export const SettingsModal = () => {
  const activeModal = useStore((store) => store.activeModal);

  return (
    <Dialog open={Boolean(activeModal)}>
      {activeModal && <DialogContent />}
    </Dialog>
  );
};
