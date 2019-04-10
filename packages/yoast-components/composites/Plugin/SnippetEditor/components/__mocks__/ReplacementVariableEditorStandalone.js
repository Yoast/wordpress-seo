import React from "react";

const focus = jest.fn();

/**
 * The mocked replacement variable editor.
 */
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

export default ReplacementVariableEditorStandalone;

export { focus };
