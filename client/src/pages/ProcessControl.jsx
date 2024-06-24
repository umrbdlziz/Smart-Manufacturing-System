import BlocklyComponent, { Block } from "../components/Blockly";
import axios from "axios";

const handlePatternSave = (code) => {
  console.log(code);
  axios
    .post("http://192.168.1.48:5003/api/process/add_process", {
      processSeq: code,
    })
    .catch((err) => {
      console.log("Error saving process:", err.message);
    });
};
const ProcessControl = () => {
  return (
    <div style={{ margin: "10px" }}>
      <BlocklyComponent handlePatternSave={handlePatternSave}>
        <Block type="movement" />
        <Block type="unloading" />
        <Block type="loading" />
        <Block type="grinding" />
        <Block type="cleaning" />
        <Block type="inspection" />
      </BlocklyComponent>
    </div>
  );
};

export default ProcessControl;
