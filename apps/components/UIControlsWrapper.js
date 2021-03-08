import React from "react";
import styled from "styled-components";

import { Checkbox, Toggle } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

const Container = styled.div`
	max-width: 1024px;
	margin: 0 auto;
	padding: 24px 24px 50em;
	box-sizing: border-box;
`;

const Separator = styled.hr`
	margin: 1em 0;
`;

const CornerstoneLink = makeOutboundLink();

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
		};

		this.toggleSimpleToggle = this.toggleSimpleToggle.bind( this );
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
						<CornerstoneLink key="1" href="https://yoa.st/metabox-help-cornerstone">cornerstone content</CornerstoneLink>,
						", for example.",
					] }
					// eslint-disable-next-line no-console
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
					// eslint-disable-next-line no-console
					onSetToggleState={ () => console.log( "onSetToggleState callback" ) }
					// eslint-disable-next-line no-console
					onToggleDisabled={ () => console.log( "onToggleDisabled callback" ) }
					disable={ true }
				/>
			</Container>
		);
	}
}
