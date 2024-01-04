import { BlocklyWorkspace } from 'react-blockly';
import Blockly, { Block } from 'blockly'
import './App.css';

const INITIAL_XML = `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="text" x="70" y="30">
    <field name="TEXT">Hello World</field>
  </block>
  <block type="set_color" x="300" y="300">
    <field name="H"></field>
    <field name="S"></field>
    <field name="B"></field>
  </block> 
</xml>`;

Blockly.Blocks['set_color'] = {
  init: function(){
    let block = this as Block;
    block.appendDummyInput()
      .appendField("set color to");
    block.appendValueInput("H")
      .setCheck(null)
      .appendField("H");
    block.appendValueInput("S")
      .setCheck(null)
      .appendField("S");
    block.appendValueInput("B")
      .setCheck(null)
      .appendField("B");
    block.setInputsInline(true);
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
    block.setColour(230);
    block.setTooltip("");
    block.setHelpUrl("");
  }
};



function App() {
  return (
    <div className="App">
      <BlocklyWorkspace
        wrapperDivClassName="fill-height" 
        workspaceConfiguration = {{
          grid:{
            spacing:20,
            length:3,
            colour:'#ccc',
            snap:true,
          },
        }}
        initialXml={INITIAL_XML}
    />
    </div>
  );
}

export default App;
