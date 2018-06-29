import React from "react";
import styled from "styled-components";

import { YoastButton } from "../composites/Plugin/Shared/components/YoastButton";
import { BaseButton, Button, IconButton, IconsButton } from "../composites/Plugin/Shared/components/Button";
import IconButtonToggle from "../composites/Plugin/Shared/components/IconButtonToggle";
import { BaseLinkButton, LinkButton } from "../composites/Plugin/Shared/components/LinkButton";

const ButtonsContainer = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 24px;
	box-sizing: border-box;
	background-color: #fff;
`;

const Separator = styled.hr`
	margin: 1em 0;
`;

/**
 * Renders all the yoast-component Buttons.
 *
 * @returns {ReactElement} The Buttons container component.
 */
export default class ButtonsList extends React.Component {
	/**
	 * Constructs the Buttons container.
	 *
	 * @returns {void}
	 */
	constructor() {
		super();

		this.state = {
			iconButtonTogglePressed: false,
		};

		this.updateIconButtonTogglePressed = this.updateIconButtonTogglePressed.bind( this );
	}

	/**
	 * Updates the IconButtonToggle pressed state.
	 *
	 * @returns {void}
	 */
	updateIconButtonTogglePressed() {
		this.setState( {
			iconButtonTogglePressed: ! this.state.iconButtonTogglePressed,
		} );
	}

	/**
	 * Renders all the buttons.
	 *
	 * @returns {ReactElement} The rendered list of buttons.
	 */
	render() {
		return (
			<ButtonsContainer>
				<BaseButton>BaseButton</BaseButton>{ ' ' }
				<Button>Button</Button>{ ' ' }
				<IconButton icon="edit">IconButton</IconButton>{ ' ' }
				<IconsButton prefixIcon="search" suffixIcon="plus">IconsButton</IconsButton><Separator />
				<BaseLinkButton href="#someresource">BaseLinkButton</BaseLinkButton>{ ' ' }
				<LinkButton href="#someresource">LinkButton</LinkButton><Separator />
				<IconButtonToggle
					name="group1"
					id="some-id"
					ariaLabel="important toggle"
					icon="eye"
					pressed={ this.state.iconButtonTogglePressed }
					onClick={ this.updateIconButtonTogglePressed }
				/> (IconButtonToggle: needs a tooltip to make its aria-label visible)
				<Separator />
				<YoastButton>YoastButton</YoastButton>
			</ButtonsContainer>
		);
	}
}
