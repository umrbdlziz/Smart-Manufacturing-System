import { useEffect, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
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
      message0: "Deliver from %1 to %2",
      args0: [
        {
          type: "field_input",
          name: "place_from",
          text: "L1",
        },
        {
          type: "field_input",
          name: "place_to",
          text: "L2",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 53,
      tooltip: "name of the place that robot need to go",
      helpUrl: "",
    },
    {
      type: "grinding",
      message0: "Grind item %1",
      args0: [
        {
          type: "input_value",
          name: "item_info",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 353,
      tooltip: "Grind the item",
      helpUrl: "",
    },
    {
      type: "cleaning",
      message0: "Clean item %1",
      args0: [
        {
          type: "input_value",
          name: "item_info",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 453,
      tooltip: "Clean the item",
      helpUrl: "",
    },
    {
      type: "item",
      message0: "Item name: %1 quantity: %2",
      args0: [
        {
          type: "field_input",
          name: "item_name",
          text: "item",
        },
        {
          type: "field_number",
          name: "quantity",
          value: 1,
          precision: 1,
        },
      ],
      output: null,
      colour: 253,
      tooltip: "item",
      helpUrl: "",
    },
  ]);

  javascriptGenerator.forBlock["movement"] = function (block) {
    const placeTo = block.getFieldValue("place_to");
    const placeFrom = block.getFieldValue("place_from");
    return `move from ${placeFrom} to ${placeTo}`;
  };

  javascriptGenerator.forBlock["grinding"] = function (block) {
    const value_item = javascriptGenerator.valueToCode(
      block,
      "item_info",
      javascriptGenerator.ORDER_ATOMIC
    );
    return `grind: {${value_item}}`;
  };

  javascriptGenerator.forBlock["cleaning"] = function (block) {
    const value_item = javascriptGenerator.valueToCode(
      block,
      "item_info",
      javascriptGenerator.ORDER_ATOMIC
    );
    return `clean: {${value_item}}`;
  };

  javascriptGenerator.forBlock["item"] = function (block) {
    const item_name = block.getFieldValue("item_name");
    const quantity = block.getFieldValue("quantity");

    const code = `"item_name": "${item_name}", "quantity": ${quantity}`;
    return [code, javascriptGenerator.ORDER_ATOMIC];
  };

  const generateCode = () => {
    let codeSnippets = [];

    const blocks = Blockly.getMainWorkspace().getAllBlocks(false);

    blocks.forEach((block) => {
      const blockCode = javascriptGenerator.forBlock[block.type](block);
      if (blockCode && block.type !== "item") {
        codeSnippets.push(blockCode);
      }
    });
    handlePatternSave(JSON.stringify(codeSnippets));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4">Process Control</Typography>
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
