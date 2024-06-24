import BlocklyComponent, { Block } from "../components/Blockly";

const handlePatternSave = () => {};
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
