import { create } from "zustand";
import { parseUrdfForJoints, parseUrdfForLinks } from "./urdfParser.js";
import { Timer } from "./Timer.js";
import { starting_tfs, starting_items } from "./Misty_Load_File.js";
import * as Blockly from "blockly";
import goalPrompt from "./prompts/goal_prompt.js";
import chatPrompt from "./prompts/chat_prompt.js";
import dummyData from "./tracker_components/dummy_data.json";
import storyData from "./tracker_components/story_goal_data.json";
import blockPrompt from "./prompts/block_prompt.js";
import { pickBy } from "lodash";
import { blockTypes } from "./blocks/text.js";
import { SELECTION_SCREEN } from "./Constants.js";

const callLLM = (llmEndpoint, llmDeployment, llmAPIKey, messageList) => {
  return fetch(
    llmEndpoint +
      "/openai/deployments/" +
      llmDeployment +
      "/chat/completions?api-version=2024-02-01",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": llmAPIKey,
      },
      body: JSON.stringify({
        messages: messageList,
      }),
    }
  );
};

const useStore = create((set, get) => ({
  ip: "",
  blocks: {},
  Start: {},
  lines: {},
  hulls: {},
  texts: {},
  points: {},
  widgets: {},
  counter: 0,
  generatedPreviously: false,
  screenToShow: SELECTION_SCREEN,
  blocklyWorkspaceXML: {},
  highlightBlocks: {},
  storyCreationGoals: { ...storyData },
  chatMessageHistory: [
    { role: "user", content: chatPrompt },
    { role: "system", content: "How can I help you today?" },
  ],
  lightMode: true,
  simOnly: false,
  isConnected: false,
  workerThread: null,
  blocklyWorkspace: null,
  llmEndpoint: "",
  llmAPIKey: "",
  llmDeployment: "",
  userPrompt: "",
  programGoals: { ...dummyData },
  llmProcessing: false,
  llmMode: false,
  showGPTConsole: false,
  fullScreenPanel: true, // Toggle to true so participants have to use the prompting system before they can start programming
  displayLLMBlockPrompt: false,
  mistyAudioList: [],
  mistyImageList: [],
  headerHeight: 0,
  headerWidth: 0,
  clock: new Timer(),
  tfs: { ...starting_tfs },
  startingTfs: JSON.parse(JSON.stringify(starting_tfs)), // Used to start the animation from the center everytime
  endingTfs: JSON.parse(JSON.stringify(starting_tfs)),
  items: { ...starting_items },
  startingItems: JSON.parse(JSON.stringify(starting_items)),
  endingItems: JSON.parse(JSON.stringify(starting_items)),
  activeModal: null,
  updateScreen: (newScreen) => set((_) => ({ screenToShow: newScreen })),
  setActiveModal: (modal) => set((_) => ({ activeModal: modal })),
  closeModal: () => set((_) => ({ activeModal: null })),
  setChatMessageHistory: (history) =>
    set((_) => ({ chatMessageHistory: history })),
  addMessageToHistory: (message) => {
    let storeData = get();
    let history = storeData.chatMessageHistory;
    set({
      llmProcessing: true,
      chatMessageHistory: [
        ...history,
        { role: "user", content: message.replace("<br>", "") },
      ],
    });
    history = get().chatMessageHistory;
    let llmEndpoint = storeData.llmEndpoint;
    let llmDeployment = storeData.llmDeployment;
    let llmAPIKey = storeData.llmAPIKey;
    callLLM(llmEndpoint, llmDeployment, llmAPIKey, history)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`LLM Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        console.log(json);
        // TODO: update based on actual response
        let sys_response = json["choices"][0].message.content;
        set({
          llmProcessing: false,
          chatMessageHistory: [
            ...history,
            { role: "system", content: sys_response },
          ],
        });
      })
      .catch((error) => {
        set({
          llmProcessing: false,
        });
        alert(`Failed to connect to ChatGPT: ${error.message}`);
      });
  },
  toggleLLMMode: (toggle) =>
    set({
      llmMode: toggle,
    }),
  setFullScreenPanel: (state) =>
    set({
      fullScreenPanel: state,
    }),
  setShowGPTConsole: (state) =>
    set({
      showGPTConsole: state,
    }),
  toggleLLMBlockPrompt: (toggle) =>
    set({
      displayLLMBlockPrompt: toggle,
    }),
  toggleTheme: (toggle) =>
    set({
      lightMode: toggle,
    }),
  getAllTasks: (isPlanning) => {
    return isPlanning ? get().storyCreationGoals : get().programGoals;
  },
  getMainTasks: (isPlanning) => {
    let data = isPlanning ? get().storyCreationGoals : get().programGoals;
    return Object.keys(data)
      .filter((key) => data[key].type === "task")
      .sort((keyA, keyB) => data[keyA].order - data[keyB].order)
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
  },
  getHighlightBlocks: () => {
    return get().highlightBlocks;
  },
  getBlocklyWorkspace: () => {
    return get().blocklyWorkspace;
  },
  setWorkerThread: (worker) =>
    set({
      workerThread: worker,
    }),
  setBlocklyWorkspace: (ws) =>
    set({
      blocklyWorkspace: ws,
    }),
  setAPIKey: (key) =>
    set({
      llmAPIKey: key,
    }),
  setEndpoint: (endpoint) =>
    set({
      llmEndpoint: endpoint,
    }),
  setDeployment: (deployment) =>
    set({
      llmDeployment: deployment,
    }),
  setImageList: (list) =>
    set({
      mistyImageList: list,
    }),
  setAudioList: (list) =>
    set({
      mistyAudioList: list,
    }),
  setUserPrompt: (userPrompt) =>
    set({
      userPrompt,
    }),
  setHighlightBlocks: (id) =>
    set({
      highlightBlocks: id,
    }),
  setHeaderDimensions: (height, width) =>
    set({
      headerHeight: height,
      headerWidth: width,
    }),
  generateProgramOutline: (retry) => {
    set({
      llmProcessing: true,
      generatedPreviously: true,
    });
    let storeData = get();
    let userPrompt = storeData.userPrompt;
    let llmEndpoint = storeData.llmEndpoint;
    let llmDeployment = storeData.llmDeployment;
    let llmAPIKey = storeData.llmAPIKey;
    let additionalPrompt = retry
      ? " Only use actionable goals for the Misty robot based on the rules specified."
      : "";
    // fetch("https://httpbin.org/delay/10")
    callLLM(llmEndpoint, llmDeployment, llmAPIKey, [
      { role: "system", content: goalPrompt },
      {
        role: "user",
        content:
          'Give me the output for the following user prompt: "' +
          userPrompt +
          '"' +
          additionalPrompt,
      },
    ])
      .then((res) => {
        if (!res.ok) {
          throw new Error(`LLM Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        let tempGoalString = json["choices"][0].message.content;
        let firstBracketLocation =
          json["choices"][0].message.content.indexOf("{");
        let lastBracketLocation =
          json["choices"][0].message.content.lastIndexOf("}") + 1;
        tempGoalString =
          tempGoalString.length > 0
            ? tempGoalString.slice(firstBracketLocation, lastBracketLocation)
            : "{}";
        set({
          programGoals: JSON.parse(tempGoalString),
          llmProcessing: false,
          activeModal: null,
        });
      })
      .catch((error) => {
        set({
          llmProcessing: false,
        });
        alert(`Failed to connect to ChatGPT: ${error.message}`);
      });
  },
  generateProgram: () => {
    set({
      llmProcessing: true,
    });
    let storeData = get();
    let userPrompt = storeData.userPrompt;
    let llmEndpoint = storeData.llmEndpoint;
    let llmDeployment = storeData.llmDeployment;
    let llmAPIKey = storeData.llmAPIKey;
    // fetch("https://httpbin.org/delay/2")
    fetch(
      llmEndpoint +
        "/openai/deployments/" +
        llmDeployment +
        "/chat/completions?api-version=2024-02-01",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": llmAPIKey,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: blockPrompt },
            {
              role: "user",
              content:
                'Give me the output for the following user prompt: "' +
                userPrompt +
                '"',
            },
          ],
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`LLM Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        console.log(json);
        let tempGoalString = json["choices"][0].message.content;
        console.log(tempGoalString);
        set({
          llmProcessing: false,
          activeModal: null,
        });
        get().loadBlocks(JSON.parse(tempGoalString), get().blocklyWorkspace);
      })
      .catch((error) => {
        set({
          llmProcessing: false,
        });
        alert(`Failed to connect to ChatGPT: ${error.message}`);
      });
  },
  clearProgram: () =>
    set({
      blocks: {},
    }),
  clearProgramExceptStart: () =>
    set({
      blocks: pickBy(get().blocks, (block) => block.type === "Start"),
    }),
  getBlockData: () => {
    let state = get();
    let blocks = state.blocks;
    let data = { data: [] };
    let blockKeys = Object.keys(blocks);
    let numBlocks = blockKeys.length;
    for (let i = 0; i < numBlocks; i++) {
      let blockData = {
        id: blocks[blockKeys[i]].id,
        type: blocks[blockKeys[i]].type,
      };
      if (blocks[blockKeys[i]].next && blocks[blockKeys[i]].next !== "") {
        blockData["nextStatement"] = blocks[blockKeys[i]].next;
      }

      let fieldKeys = blocks[blockKeys[i]]?.inputs
        ? Object.keys(blocks[blockKeys[i]]?.inputs)
        : [];
      for (let j = 0; j < fieldKeys.length; j++) {
        blockData[fieldKeys[j]] = blocks[blockKeys[i]]["inputs"][
          fieldKeys[j]
        ]?.["shadow"]
          ? blocks[blockKeys[i]]["inputs"][fieldKeys[j]]["shadow"].id
          : blocks[blockKeys[i]]["inputs"][fieldKeys[j]];
      }

      // Will need to do this for each input type (colors, numbers)
      if (
        [
          "logic_boolean",
          "math_number",
          "colour_picker",
          "text",
          "MoveHead",
          "MoveArm3",
          "Turn2",
          "SpeakDefault",
          "math_number_property",
          "logic_compare",
          "logic_operation",
        ].includes(blockData.type)
      ) {
        let objFieldKeys = Object.keys(blocks[blockKeys[i]].fields);
        blockData["value"] = blocks[blockKeys[i]].fields[objFieldKeys[0]];
      }

      if (
        [
          "BasicSlider",
          "ArmPositionSlider",
          "SpeedSlider",
          "TimeSlider",
          "HeadPitchSlider",
          "HeadRollSlider",
          "HeadYawSlider",
        ].includes(blockData.type)
      ) {
        blockData["value"] = blocks[blockKeys[i]].fields["FIELD_slider_value"];
      }
      data["data"].push({ ...blockData });
    }
    return data;
  },
  loadBlocks: (data, ws) => {
    // Create blocks
    let startBlocks = ws.getBlocksByType("Start");
    if (startBlocks.length > 0) {
      get().clearProgramExceptStart();
    } else {
      get().clearProgram();
    }
    ws.clear();
    let initialBlock = startBlocks.length > 0 ? startBlocks[0] : null;
    let blockIds = [];
    let blocklyBlockIds = [];
    let nextList = [data["data"][0].id];
    let ignoredBlocks = [];
    for (let i = 0; i < data["data"].length; i++) {
      let type = data["data"][i]["type"];
      if (["face", "audio"].includes(type)) {
        type = data["data"][i]["value"];
      }

      // Ignore non-correct blocks
      if (!blockTypes.includes(type)) {
        ignoredBlocks.push(data["data"][i]["id"]);
        continue;
      }

      let t = Blockly.serialization.blocks.append(
        {
          type: type,
        },
        ws
      );
      if (t.type === "Start") {
        initialBlock = t;
      }

      if (type === "logic_boolean") {
        t.getField("BOOL").setValue(data["data"][i]["value"]);
      }
      if (type === "math_number") {
        t.getField("NUM").setValue(data["data"][i]["value"]);
      }
      if (type === "colour_picker") {
        t.getField("COLOUR").setValue(data["data"][i]["value"]);
      }
      if (type === "text") {
        t.getField("TEXT").setValue(data["data"][i]["value"]);
      }
      if (type === "MoveHead") {
        t.getField("FIELD_MoveHead_Pitch").setValue(data["data"][i]["value"]);
      }
      if (type === "MoveArm3") {
        t.getField("FIELD_MoveArm_Arm").setValue(data["data"][i]["value"]);
      }
      if (type === "Turn2") {
        t.getField("FIELD_Turn_Direction").setValue(data["data"][i]["value"]);
      }
      if (type === "SpeakDefault") {
        t.getField("FIELD_SpeakDefault_Text").setValue(
          data["data"][i]["value"]
        );
      }
      if (type === "math_number_property") {
        t.getField("PROPERTY").setValue(data["data"][i]["value"]);
      }
      if (type === "logic_compare" || type === "logic_operation") {
        t.getField("OP").setValue(data["data"][i]["value"]);
      }

      if (
        [
          "BasicSlider",
          "ArmPositionSlider",
          "SpeedSlider",
          "TimeSlider",
          "HeadPitchSlider",
          "HeadRollSlider",
          "HeadYawSlider",
        ].includes(type)
      ) {
        t.getField("FIELD_slider_value").setValue(data["data"][i]["value"]);
      }

      blockIds.push(data["data"][i]["id"]);
      blocklyBlockIds.push(t.id);
      if (data["data"][i]?.["nextStatement"]) {
        nextList.push([data["data"][i]["id"], data["data"][i]?.["nextStatement"]]);
      }
    }

    // Connect blocks to parameters
    for (let i = 0; i < data["data"].length; i++) {
      // Ignore non-correct blocks
      if (ignoredBlocks.includes(data["data"][i]["id"])) {
        continue;
      }
      let currentBlock = ws.getBlockById(
        blocklyBlockIds[blockIds.indexOf(data["data"][i]["id"])]
      );
      if (currentBlock) {
        Object.keys(data["data"][i]).forEach((key) => {
          if (
            !(
              key === "id" ||
              key === "value" ||
              key === "type" ||
              key === "nextStatement"
            )
          ) {
            // Don't add parameters if the parameter block was invalid
            const paramBlock = ws.getBlockById(
              blocklyBlockIds[blockIds.indexOf(data["data"][i][key])]
            );
            if (paramBlock) {
              currentBlock
                .getInput(key)
                .connection.connect(paramBlock.outputConnection ? paramBlock.outputConnection : paramBlock.previousConnection);
            }
          }
        });
      }
    }

    // Connect blocks to parents
    for (let i = 1; i < nextList.length; i++) {
      // Ignore non-correct blocks
      // Will cause a break in code
      if (ignoredBlocks.includes(nextList[i][1])) {
        continue;
      }
      let currentBlock = ws.getBlockById(
        blocklyBlockIds[blockIds.indexOf(nextList[i][1])]
      );
      let parentBlock = ws.getBlockById(
        blocklyBlockIds[blockIds.indexOf(nextList[i][0])]
      );
      if (currentBlock) {
        parentBlock?.nextConnection.connect(currentBlock.previousConnection);
      }
    }

    let currentBlock = ws.getBlockById(
      blocklyBlockIds[blockIds.indexOf(nextList[0])]
    );
    initialBlock.nextConnection.connect(currentBlock.previousConnection);
  },
  setIsConnected: (isConnected) => set({ isConnected: isConnected }),
  loadFromURDF: (urdfFile) =>
    set({
      tfs: { ...parseUrdfForJoints(urdfFile) },
      items: { ...parseUrdfForLinks(urdfFile) },
    }),
  setIp: (ip) => set({ ip }),
  disconnect: () =>
    set({
      ip: "",
      isConnected: false,
      mistyAudioList: [],
      mistyImageList: [],
    }),
  addBlock: (id, json) =>
    set((state) => ({
      blocks: { ...state.blocks, [id]: json },
    })),
  removeBlock: (ids) =>
    set((state) => {
      // Create a new object excluding the block with the given id
      const newBlocks = Object.keys(state.blocks).reduce((acc, currentId) => {
        if (!ids.includes(currentId)) {
          acc[currentId] = state.blocks[currentId];
        }
        return acc;
      }, {});

      // Update the state with the new blocks object
      return { blocks: newBlocks };
    }),

  updateBlock: (id, updatedJson) =>
    set((state) => ({
      blocks: { ...state.blocks, [id]: updatedJson },
    })),
  getBlock: (id) => get().blocks[id],
  getBlocks: () => get().blocks,
  getItems: () => get().items,
  getEndingItems: () => get().endingItems,
  addBlocktoStart: (id, json) =>
    set((state) => ({
      Start: { ...state.Start, [id]: json },
    })),

  removeBlockfromStart: (id) =>
    set((state) => {
      // Create a new object excluding the block with the given id
      const newBlocks = Object.keys(state.Start).reduce((acc, currentId) => {
        if (currentId !== id) {
          acc[currentId] = state.Start[currentId];
        }
        return acc;
      }, {});
      return { Start: newBlocks };
    }),
  getBlocksByType: (type) => {
    const blocks = get().blocks;
    return Object.values(blocks).filter((block) => block.type === type)[0];
  },
  getBlockType: (id) => {
    const blocks = get().blocks;
    return blocks[id]?.type || "Unknown block type";
  },
  setWorkspaceXml: (xml) => set({ blocklyWorkspaceXML: xml }),
  getWorkspaceXml: () => get().blocklyWorkspaceXML,
  onPointerMissed: () => console.log("Missed Click"),
  onPointerOver: () => {},
  onPointerOut: () => {},
  resetSim: () => {
    const allTfs = JSON.parse(JSON.stringify(get().startingTfs));
    const allItems = JSON.parse(JSON.stringify(get().startingItems));
    set({
      tfs: {
        ...allTfs,
      },
      endingTfs: {
        ...allTfs,
      },
      items: {
        ...allItems,
      },
      endingItems: {
        ...allItems,
      },
    });
  },
  toggleSimOnly: (value) => {
    set({
      simOnly: value,
    });
  },
  setAnimationFrames: (newTfs, newEndingTfs, newItems, newEndingItems) => {
    set({
      tfs: { ...newTfs },
      endingTfs: { ...newEndingTfs },
      items: { ...newItems },
      endingItems: { ...newEndingItems },
    });
  },
}));

export default useStore;
