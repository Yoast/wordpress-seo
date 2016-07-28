
import Component from '../generators/component';

const Input = (props) => <input type="{props.type}" />

let TextInput = Component(Input)

export default TextInput;