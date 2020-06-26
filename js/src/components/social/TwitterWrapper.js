import { Fragment } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

/**
 * This wrapper is connected to the twitter container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' twitter Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {wp.Element} Renders the TwitterWrapper React Component.
 */
const TwitterWrapper = ( props ) => {
	return (
		<Fragment>
			{
				props.isPremium
					? <Slot
						name="YoastTwitterPremium"
						fillProps={ props }
					/>
					: <SocialForm { ...props } />
			}
		</Fragment>
	);
};

export default TwitterWrapper;

TwitterWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
};
