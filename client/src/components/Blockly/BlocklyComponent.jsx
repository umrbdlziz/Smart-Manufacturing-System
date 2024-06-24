import { useEffect, useRef } from "react";
import { Button, Box } from "@mui/material";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";
import "blockly/javascript";

import PropTypes from "prop-types";

const BlocklyComponent = ({ handlePatternSave, children }) => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
    });

    return () => {
      workspace.dispose();
    };
  }, []);

  Blockly.defineBlocksWithJsonArray([
    {
      type: "movement",
      message0: "Move to %1",
      args0: [
        {
          type: "field_input",
          name: "place_name",
          text: "L1",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 53,
      tooltip: "name of the place that robot need to go",
      helpUrl: "",
    },
    {
      type: "unloading",
      message0: "Unload item",
      previousStatement: null,
      nextStatement: null,
      colour: 153,
      tooltip: "Unload the item from the robot",
      helpUrl: "",
    },
    {
      type: "loading",
      message0: "Load item",
      previousStatement: null,
      nextStatement: null,
      colour: 253,
      tooltip: "Load the item to the robot",
      helpUrl: "",
    },
    {
      type: "grinding",
      message0: "Grind item",
      previousStatement: null,
      nextStatement: null,
      colour: 353,
      tooltip: "Grind the item",
      helpUrl: "",
    },
    {
      type: "cleaning",
      message0: "Clean item",
      previousStatement: null,
      nextStatement: null,
      colour: 453,
      tooltip: "Clean the item",
      helpUrl: "",
    },
    {
      type: "inspection",
      message0: "Inspect item",
      previousStatement: null,
      nextStatement: null,
      colour: 13,
      tooltip: "Inspect the item",
      helpUrl: "",
    },
  ]);

  // javascriptGenerator.forBlock["level"] = function (block) {
  //   const levelName = block.getFieldValue("level_name");
  //   const rows = block.getFieldValue("rows");
  //   const columns = block.getFieldValue("columns");

  //   return `"${levelName}":{"${rows}":${columns}},`;
  // };

  javascriptGenerator.forBlock["movement"] = function (block) {
    const placeName = block.getFieldValue("place_name");
    return "move to " + placeName;
  };

  javascriptGenerator.forBlock["unloading"] = function () {
    return "unload";
  };

  javascriptGenerator.forBlock["loading"] = function () {
    return "load";
  };

  javascriptGenerator.forBlock["grinding"] = function () {
    return "grind";
  };

  javascriptGenerator.forBlock["cleaning"] = function () {
    return "clean";
  };

  javascriptGenerator.forBlock["inspection"] = function () {
    return "inspect";
  };

  const generateCode = () => {
    // Initialize an empty array to hold code snippets
    let codeSnippets = [];

    // Get all blocks in the main workspace
    const blocks = Blockly.getMainWorkspace().getAllBlocks(false);

    // Iterate over each block and generate code for it
    blocks.forEach((block) => {
      // Use the existing generator for the block type
      const blockCode = javascriptGenerator.forBlock[block.type](block);
      // Push the generated code snippet (if any) into the array
      if (blockCode) {
        codeSnippets.push(blockCode);
      }
    });

    // Handle the array of code snippets as needed
    console.log(codeSnippets); // Example: Log the array

    // If you need to save or further process the array, do so here
    // For example, converting array to a JSON string to save
    handlePatternSave(JSON.stringify(codeSnippets));
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <h2>Process Control</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={generateCode}
          sx={{ height: "40px" }}
        >
          Save
        </Button>
      </Box>
      <Box display="flex" height="75vh">
        <div ref={blocklyDiv} style={{ flex: 1 }}></div>
        <xml
          ref={toolbox}
          style={{ display: "none" }}
          xmlns="http://www.w3.org/1999/xhtml"
        >
          {children}
        </xml>
      </Box>
    </Box>
  );
};

BlocklyComponent.propTypes = {
  children: PropTypes.node,
  handlePatternSave: PropTypes.func,
};

export default BlocklyComponent;
