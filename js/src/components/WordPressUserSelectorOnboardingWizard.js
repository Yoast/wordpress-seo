import { Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Label } from "@yoast/components";
import WordPressUserSelector from "./WordPressUserSelector";
import valueToNativeEvent from "./higherorder/valueToNativeEvent";

class WordPressUserSelectorOnboardingWizard extends Component {
	render() {
		return (
			<Fragment>
				<Label
					for={ this.props.name }
					optionalAttributes={ {
						className: "yoast-wizard-text-input-label",
					} }
				>
					{ __( "The name of the person", "wordpress-seo" ) }
				</Label>
				<WordPressUserSelector { ...this.props } />
			</Fragment>
		);
	}
}

export default valueToNativeEvent( WordPressUserSelectorOnboardingWizard );
