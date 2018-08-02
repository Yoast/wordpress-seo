import React from "react";
import styled from "styled-components";

import Checkbox from "../composites/Plugin/Shared/components/Checkbox";
import Toggle from "../composites/Plugin/Shared/components/Toggle";
import CornerstoneToggle from "../composites/Plugin/CornerstoneContent/components/CornerstoneToggle.js";

const Container = styled.div`
	max-width: 1024px;
	margin: 0 auto;
	padding: 24px 24px 50em;
	box-sizing: border-box;
`;

const Separator = styled.hr`
	margin: 1em 0;
`;

/**
 * Renders the yoast-component UI Controls.
 *
 * @returns {ReactElement} The UI Controls container component.
 */
export default class UIControlsList extends React.Component {
	/**
	 * Constructs the UI Controls container.
	 *
	 * @returns {void}
	 */
	constructor() {
		super();

		this.state = {
			simpleToggleChecked: false,
			cornerstoneToggleChecked: false,
		};

		this.toggleSimpleToggle = this.toggleSimpleToggle.bind( this );
		this.toggleCornerstoneToggle = this.toggleCornerstoneToggle.bind( this );
	}

	/**
	 * Toggles the simple toggle state.
	 *
	 * @returns {void}
	 */
	toggleSimpleToggle() {
		this.setState( {
			simpleToggleChecked: ! this.state.simpleToggleChecked,
		} );
	}

	/**
	 * Toggles the Cornerstone toggle state.
	 *
	 * @returns {void}
	 */
	toggleCornerstoneToggle() {
		this.setState( {
			cornerstoneToggleChecked: ! this.state.cornerstoneToggleChecked,
		} );
	}

	/**
	 * Renders all the UI Controls.
	 *
	 * @returns {ReactElement} The rendered list of UI Controls.
	 */
	render() {
		return (
			<Container>
				<h2>Checkbox</h2>
				<Checkbox
					id="example-checkbox"
					label={ [
						"This is a label that also accepts arrays, so you can pass links such as ",
						<a
							key="1"
							href="https://yoa.st/metabox-help-cornerstone?utm_content=7.0.3"
							target="_blank"
							rel="noopener noreferrer"
						>cornerstone content</a>,
						", for example.",
					] }
					onChange={ event => console.log( event ) }
				/>
				<Separator />
				<h2>Simple toggle</h2>
				<Toggle
					id="simple-toggle"
					labelText="Test the Toggle"
					isEnabled={ this.state.simpleToggleChecked }
					onSetToggleState={ this.toggleSimpleToggle }
				/>
				<Separator />
				<Toggle
					id="disabled-toggle"
					labelText="Disabled Toggle"
					isEnabled={ false }
					onSetToggleState={ () => console.log( "onSetToggleState callback" ) }
					onToggleDisabled={ () => console.log( "onToggleDisabled callback" ) }
					disable={ true }
				/>
				<Separator />
				<h2>Cornerstone toggle</h2>
				<CornerstoneToggle
					isEnabled={ this.state.cornerstoneToggleChecked }
					onToggle={ this.toggleCornerstoneToggle }
				/>
			</Container>
		);
	}
}
