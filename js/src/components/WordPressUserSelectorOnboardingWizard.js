/* External dependencies */
import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/components";
import styled from "styled-components";

/* Internal dependencies */
import WordPressUserSelector from "./WordPressUserSelector";
import valueToNativeEvent from "./higherorder/valueToNativeEvent";

const Container = styled.div`
	max-width: 250px;
	padding-bottom: 7px;
`;

class WordPressUserSelectorOnboardingWizard extends Component {
	render() {
		return (
			<Container>
				<Label
					for={ this.props.name }
					optionalAttributes={ {
						className: "yoast-wizard-text-input-label",
					} }
				>
					{ __( "The name of the person", "wordpress-seo" ) }
				</Label>
				<WordPressUserSelector { ...this.props } />
			</Container>
		);
	}
}

export default valueToNativeEvent( WordPressUserSelectorOnboardingWizard );
