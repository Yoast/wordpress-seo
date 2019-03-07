import React from "react";
import PropTypes from "prop-types";

const focus = jest.fn();

class ReplacementVariableEditorStandalone extends React.Component {
	/**
	 * Constructs the mocked replacement variable editor.
	 *
	 * Creates mock functions for certain methods that can be watched later.
	 *
	 * @param {Object} props Passed props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.focus = focus;
	}

	/**
	 * @returns {ReactElement} Only a div because the props are already in the snapshot.
	 */
	render() {
		return (
			<div />
		);
	}
}

/**
 * Wraps the ReplacementVariableEditorStandalone component to pass the innerRef as a ref.
 *
 * @param {Object} props The components props.
 *
 * @returns {ReactElement} The wrapped ReplacementVariableEditorStandalone component.
 * @constructor
 */
const Wrapper = ( props ) => {
	return <ReplacementVariableEditorStandalone
		{ ...props }
		ref={ props.innerRef }
	/>;
};

Wrapper.propTypes = {
	innerRef: PropTypes.func,
};

export default Wrapper;

export { focus };
