import React from "react";
import styled from "styled-components";

import { UpsellButton } from "../composites/Plugin/Shared/components/UpsellButton";
import { YoastButton } from "../composites/Plugin/Shared/components/YoastButton";
import { YoastLinkButton } from "../composites/Plugin/Shared/components/YoastLinkButton";
import { BaseButton, Button, IconButton, IconsButton } from "../composites/Plugin/Shared/components/Button";
import IconButtonToggle from "../composites/Plugin/Shared/components/IconButtonToggle";
import { BaseLinkButton, LinkButton } from "../composites/Plugin/Shared/components/LinkButton";
import FormButton from "../forms/Button";
import IconLabelledButton from "../composites/Plugin/Shared/components/IconLabelledButton";

const ButtonsContainer = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 24px;
	box-sizing: border-box;

	.with-max-width {
		max-width: 120px;
	}

	.test-large-button {
		min-width: 240px;
	}
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
				<IconButton icon="edit" iconColor="#c00" aria-label="IconButton with icon only" />{ ' ' }
				<IconsButton prefixIcon={ { icon: "search" } } suffixIcon={ { icon: "plus" } }>IconsButton</IconsButton>
				<Separator />
				<BaseLinkButton href="#someresource">BaseLinkButton</BaseLinkButton>{ ' ' }
				<LinkButton href="#someresource">LinkButton</LinkButton>
				<Separator />
				<IconButtonToggle
					name="group1"
					id="some-id"
					ariaLabel="important toggle"
					icon="eye"
					pressed={ this.state.iconButtonTogglePressed }
					onClick={ this.updateIconButtonTogglePressed }
				/> (IconButtonToggle: needs a tooltip to make its aria-label visible)
				<Separator />
				<YoastButton>YoastButton</YoastButton>{ ' ' }
				<UpsellButton>Upsell Button</UpsellButton>

				<Separator />
				<IconLabelledButton icon="question-circle">Need help?</IconLabelledButton>
				<IconLabelledButton	icon="gear">Settings</IconLabelledButton>
				<IconLabelledButton
					hoverBackgroundColor="#a4286a"
					hoverColor="white"
					icon="eye"
				>
					Custom Hover
				</IconLabelledButton>
				<IconLabelledButton
					focusBackgroundColor="#e1bee7"
					focusBorderColor="#a4286a"
					focusColor="#a4286a"
					icon="key"
				>
					Custom Focus
				</IconLabelledButton>
				<IconLabelledButton
					activeBackgroundColor="yellow"
					activeBorderColor="black"
					activeColor="black"
					icon="list"
				>
					Custom Active
				</IconLabelledButton>
				<IconLabelledButton	icon="plus" textFontSize="13px">Custom Font Size</IconLabelledButton>
				<Separator />
				<FormButton text="FormButton" onClick={ () => {
					console.log( "hello FormButton clicked" );
				} } />
				<Separator />
				<h2>Special cases</h2>
				<IconButton icon="edit" iconColor="#c00" aria-label="IconButton with icon only" />{ ' ' }
				<IconButton icon="edit" iconColor="#c00" className="with-max-width">With max-width and long text</IconButton>{ ' ' }
				<YoastButton backgroundColor="lightblue" textColor="#333" withTextShadow={ false }>Color</YoastButton>{ ' ' }
				<YoastButton className="test-large-button">Min width</YoastButton>{ ' ' }

				<h2>Test min-height bugs</h2>
				<p>Increase the `settings.minHeight` value in the components to check the Safari and IE11 bugs,
					see <a href="https://github.com/Yoast/yoast-components/pull/262">https://github.com/Yoast/yoast-components/pull/262</a> and <a href="https://github.com/Yoast/yoast-components/pull/284">https://github.com/Yoast/yoast-components/pull/284</a>
				</p>
				<h3>Buttons</h3>
				<BaseButton>Base</BaseButton>{ ' ' }
				<Button>Button</Button>{ ' ' }
				<YoastButton backgroundColor="lightblue" textColor="#333" withTextShadow={ false }>Color</YoastButton>{ ' ' }
				<YoastButton className="test-large-button">Min width</YoastButton>{ ' ' }
				<IconButton icon="edit" iconColor="#c00" aria-label="IconButton with icon only" />{ ' ' }
				<IconButton icon="edit" iconColor="#c00" className="with-max-width">With max-width and long text</IconButton>{ ' ' }
				<h3>Links</h3>
				<BaseLinkButton href="#somewhere1">Base</BaseLinkButton>{ ' ' }
				<LinkButton href="#somewhere2">Button</LinkButton>{ ' ' }
				<YoastLinkButton href="#somewhere4" backgroundColor="lightblue" textColor="#333" withTextShadow={ false }>Color</YoastLinkButton>{ ' ' }
				<YoastLinkButton className="test-large-button" href="#somewhere3">Min width</YoastLinkButton>
			</ButtonsContainer>
		);
	}
}
