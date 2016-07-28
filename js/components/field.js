import React from 'react';

/**
 * Represents a field component.
 */
class Field extends React.Component {
	constructor() {
		super();
	}

	/**
	 * Sets the current state
	 */
	componentWillMount() {
		this.setState( this.props );
	}
}


export default Field;