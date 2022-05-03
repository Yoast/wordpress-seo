import React from "react";

const focus = jest.fn();
const actual = jest.requireActual( "@yoast/replacement-variable-editor" );

/**
 * The mocked replacement variable editor.
 */
class ReplacementVariableEditorMock extends React.Component {
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

		// eslint-disable-next-line react/prop-types
		props.editorRef( { focus } );
	}

	/**
	 * @returns {ReactElement} Only a div because the props are already in the snapshot.
	 */
	render() {
		return <div />;
	}
}

module.exports = {
	...actual,
	ReplacementVariableEditor: ReplacementVariableEditorMock,
	focus,
};
