import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import {Fragment, Component} from "@wordpress/element";
import { FieldGroup } from "@yoast/components";
import WincherToggle from "./WincherToggle";


export function trackAllKeyphrases( toggleState ) {
	console.log( "Hello!", toggleState );
}

class WincherPostPublish extends Component {
	render() {
		const displayToggle = this.props.trackedKeyphrases.length === 0;

		return (
			<Fragment>
				<FieldGroup
					label={ __( "SEO performance", "wordpress-seo" ) }
					linkTo={ "https://google.com" }
					linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
				/>
				{ displayToggle && <WincherToggle
					onToggle={ this.props.toggleTrackAll }
					isEnabled={ this.props.isTrackingArticle } /> }
				{ ! displayToggle && <p>{ __( "Manual tracking has already been set for one or more keyphrases.", "wordpress-seo" ) }</p> }
			</Fragment>
		);
	}
}

/**
 * Renders the WincherPostPublish Yoast integration.
 *
 * @returns {wp.Element} The WincherPostPublish panel.
 */
// export default function WincherPostPublish( props ) {
// 	const {
// 		isTrackingArticle,
// 		trackedKeyphrases,
// 		toggleTrackAll,
// 		setIsTrackingAll,
// 	} = props;
//
// 	const displayToggle = trackedKeyphrases.length === 0;
//
// 	console.log(isTrackingArticle)
//
// 	return <Fragment>
// 		<FieldGroup
// 			label={ __( "SEO performance", "wordpress-seo" ) }
// 			linkTo={ "https://google.com" }
// 			linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
// 		/>
// 		{ displayToggle && <WincherToggle onToggle={ toggleTrackAll } isEnabled={ isTrackingArticle } /> }
// 		{ ! displayToggle && <p>{ __( "Manual tracking has already been set for one or more keyphrases.", "wordpress-seo" ) }</p> }
// 	</Fragment>;
// }

WincherPostPublish.propTypes = {
	trackedKeyphrases: PropTypes.array,
};

WincherPostPublish.defaultProps = {
	trackedKeyphrases: [],
};

export default WincherPostPublish;
