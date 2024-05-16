import React from "react";
import { Box, Card, CardContent, Dialog, Input } from "@mui/material";
import useStore from "../Store";
import FileSaver from "file-saver";
import SettingsDiv from "./SettingsDiv";
import LabeledButton from "./LabeledButton";
import DropShadowButton from "./DropShadowButton";
import * as Blockly from "blockly";
import { useShallow } from "zustand/react/shallow";
import LabeledTextField from "./LabeledTextField";

const DialogContent = () => {
  const closeModal = useStore((store) => store.closeModal);
  const setEndpoint = useStore((store) => store.setEndpoint);
  const setAPIKey = useStore((store) => store.setAPIKey);
  const setDeployment = useStore((store) => store.setDeployment);
  const llmDeployment = useStore(useShallow((state) => state.llmDeployment));
  const llmAPIKey = useStore(useShallow((state) => state.llmAPIKey));
  const llmEndpoint = useStore(useShallow((state) => state.llmEndpoint));
  const blocklyWorkspace = useStore((state) => state.blocklyWorkspace);

  const handleDownload = () => {
    var blob = new Blob([activityLog], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "activity log.txt");
  };

  const downloadWorkspace = () => {
    const xmlText = Blockly.Xml.domToPrettyText(
      Blockly.Xml.workspaceToDom(blocklyWorkspace)
    );
    const blob = new Blob([xmlText], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "myBlocks.xml";
    a.click();
  };

  const uploadBlocks = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const text = fileReader.result;
      if (blocklyWorkspace) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/xml");
          Blockly.Xml.domToWorkspace(doc.firstChild, blocklyWorkspace);
        } catch (error) {
          console.error("Error parsing XML:", error);
        }
      } else {
        console.error("Blockly workspace not initialized");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#585D92",
        padding: "5px",
        margin: "0",
        borderRadius: "10px",
        maxHeight: "70vh",
        width: "20vw",
        overflowY: "scroll",
      }}
    >
      <SettingsDiv title={"LLM Settings"}>
        <LabeledTextField
          onChangeFunction={(e) => setEndpoint(e.target.value)}
          label={"Server Endpoint"}
          fieldType={"password"}
          textFieldInput={llmEndpoint}
        />
        <LabeledTextField
          onChangeFunction={(e) => setAPIKey(e.target.value)}
          label={"API Key"}
          fieldType={"password"}
          textFieldInput={llmAPIKey}
        />
        <LabeledTextField
          onChangeFunction={(e) => setDeployment(e.target.value)}
          label={"Deployment Model"}
          fieldType={"password"}
          textFieldInput={llmDeployment}
        />
      </SettingsDiv>
      <SettingsDiv title={"Downloads"}>
        <LabeledButton
          clickFunction={handleDownload}
          label={"Download Activity Log"}
          buttonText={"Download"}
        />
        <LabeledButton
          clickFunction={downloadWorkspace}
          label={"Download Workspace XML"}
          buttonText={"Download"}
        />
      </SettingsDiv>

      <SettingsDiv title={"Upload"}>
        {/* TODO!!!!!!! !!!!!!!!! */}
        <Input type="file" onChange={uploadBlocks} accept=".xml" />
      </SettingsDiv>

      <DropShadowButton
        clickFunction={closeModal}
        text={"Close"}
        style={{ float: "right" }}
      />
    </Box>
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
