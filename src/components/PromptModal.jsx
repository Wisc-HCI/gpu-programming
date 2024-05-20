import React from "react";
import { Box, Dialog } from "@mui/material";
import useStore from "../Store";
import { PROMPT_MODAL } from "../Constants";
import UserPromptInput from "./UserPromptInput";

const DialogContent = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#585D92",
        padding: "15px",
        margin: "0",
        borderRadius: "10px",
        maxHeight: "70vh",
        overflowY: "scroll",
      }}
    >
        <UserPromptInput style={{backgroundColor: "#FAFAFA", borderRadius: "5px"}} maxVH={50}/>
    </Box>
  );
};

export const PromptModal = () => {
    const setActiveModal = useStore((store) => store.setActiveModal);
    const activeModal = useStore((store) => store.activeModal);

  return (
    <Dialog open={activeModal === PROMPT_MODAL} onClose={(_, reason) => {if (reason === "backdropClick") { setActiveModal("") }}} >
      {activeModal && <DialogContent />}
    </Dialog>
  );
};
