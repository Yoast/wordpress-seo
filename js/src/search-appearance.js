import ReactDOM from "react-dom";
import React from "react";

import SettingsReplacementVariableEditor from "./components/SettingsReplacementVariableEditors";

const editorElements = document.querySelectorAll( "[data-react-replacevar]" );
const element = document.createElement( "div" );
document.body.append( element );

ReactDOM.render(
	<SettingsReplacementVariableEditor
		elements={ editorElements }
		/>,
	element
);
