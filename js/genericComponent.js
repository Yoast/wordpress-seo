import React from 'react';

class GenericComponent extends React.Component {
	constructor( props ) {
		super();
		console.log( props )
	}

	render() {
		return (
			<div>
				<h1 {...this.props}>{this.props.children}</h1>
				{/*<{this.state.type}>{this.state.body}</{this.state.type}>*/}
			</div>
		)
	}
}

GenericComponent.propTypes = {};

GenericComponent.defaultProps = {};

export default GenericComponent;