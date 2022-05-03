// External dependencies.
import React from "react";
import styled from "styled-components";

// Yoast dependencies.
import {
	BaseButton,
	Button,
	IconButton,
	IconButtonToggle,
	IconLabeledButton,
	IconsButton,
	LinkButton,
	UpsellButton,
	UpsellLinkButton,
	YoastButton,
	YoastLinkButton,
} from "@yoast/components";

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
 * @returns {React.Element} The Buttons container component.
 */
export default class ButtonsList extends React.Component {
	/**
	 * Constructs the Buttons container.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

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
		this.setState( prevState => ( {
			iconButtonTogglePressed: ! prevState.iconButtonTogglePressed,
		} ) );
	}

	/**
	 * Renders all the buttons.
	 *
	 * @returns {React.Element} The rendered list of buttons.
	 */
	render() {
		return (
			<ButtonsContainer>
				<BaseButton>BaseButton</BaseButton>{ " " }
				<Button>Button</Button>{ " " }
				<IconButton icon="edit">IconButton</IconButton>{ " " }
				<IconButton icon="edit" iconColor="#c00" aria-label="IconButton with icon only" />{ " " }
				<IconsButton prefixIcon={ { icon: "search" } } suffixIcon={ { icon: "plus" } }>IconsButton</IconsButton>
				<Separator />
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
				<YoastButton>YoastButton</YoastButton>{ " " }
				<UpsellButton>Upsell Button</UpsellButton>{ " " }
				<UpsellLinkButton href="http://example.org">Upsell Link Button</UpsellLinkButton>
				<Separator />
				<IconLabeledButton icon="question-circle">Need help?</IconLabeledButton>
				<IconLabeledButton icon="gear">Settings</IconLabeledButton>
				<IconLabeledButton
					hoverBackgroundColor="#a4286a"
					hoverColor="#fff"
					icon="eye"
				>
					Custom Hover
				</IconLabeledButton>
				<IconLabeledButton
					focusBackgroundColor="#e1bee7"
					focusBorderColor="#a4286a"
					focusColor="#a4286a"
					icon="key"
				>
					Custom Focus
				</IconLabeledButton>
				<IconLabeledButton
					activeBackgroundColor="#ff0"
					activeBorderColor="#000"
					activeColor="#000"
					icon="list"
				>
					Custom Active
				</IconLabeledButton>
				<IconLabeledButton icon="plus" textFontSize="13px">Custom Font Size</IconLabeledButton>
				<Separator />
				<h2>Special cases</h2>
				<IconButton icon="edit" iconColor="#c00" aria-label="IconButton with icon only" />{ " " }
				<IconButton icon="edit" iconColor="#c00" className="with-max-width">With max-width and long
					text</IconButton>{ " " }
				<YoastButton
					backgroundColor="lightblue" textColor="#333"
					withTextShadow={ false }
				>
					Color
				</YoastButton>{ " " }
				<YoastButton className="test-large-button">Min width</YoastButton>{ " " }

				<h2>Test min-height bugs</h2>
				<p>
					Increase the `settings.minHeight` value in the components to check the Safari and IE11 bugs,
					see
					<a href="https://github.com/Yoast/yoast-components/pull/262">https://github.com/Yoast/yoast-components/pull/262</a>
					and
					<a href="https://github.com/Yoast/yoast-components/pull/284">https://github.com/Yoast/yoast-components/pull/284</a>
				</p>
				<h3>Buttons</h3>
				<BaseButton>Base</BaseButton>{ " " }
				<YoastButton
					backgroundColor="lightblue" textColor="#333"
					withTextShadow={ false }
				>
					Color
				</YoastButton>{ " " }
				<YoastButton className="test-large-button">Min width</YoastButton>{ " " }
				<IconButton icon="edit" iconColor="#c00" aria-label="IconButton with icon only" />{ " " }
				<IconButton icon="edit" iconColor="#c00" className="with-max-width">With max-width and long
					text</IconButton>{ " " }
				<h3>Links</h3>
				<LinkButton href="#somewhere2">Button</LinkButton>{ " " }
				<YoastLinkButton
					href="#somewhere4" backgroundColor="lightblue" textColor="#333"
					withTextShadow={ false }
				>
					Color
				</YoastLinkButton>{ " " }
				<YoastLinkButton className="test-large-button" href="#somewhere3">Min width</YoastLinkButton>
			</ButtonsContainer>
		);
	}
}
