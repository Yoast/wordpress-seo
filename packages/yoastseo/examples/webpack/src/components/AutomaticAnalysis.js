import React from "react";
import { connect } from "react-redux";
import { noop } from "lodash-es";

import Toggle from "yoast-components/composites/Plugin/Shared/components/Toggle";
import { setAutomaticRefresh } from "../redux/actions/worker";


function AutomaticAnalysis( { isEnabled, onToggle } ) {
	return <Toggle
		id="toggle-automatic-analysis"
		labelText="Automatic analysis"
		isEnabled={ isEnabled }
		onSetToggleState={ onToggle }
		onToggleDisabled={ noop }
	/>;
}

export default connect(
	( state ) => {
		return {
			isEnabled: state.worker.isAutomaticRefreshEnabled,
		};
	},
	( dispatch ) => {
		return {
			onToggle: ( val ) => dispatch( setAutomaticRefresh( val ) ),
		};
	}
)( AutomaticAnalysis );
