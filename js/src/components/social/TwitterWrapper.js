import { Fragment, useEffect } from "@wordpress/element";
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
	useEffect( () => {
		// Load on the next cycle because the editor inits asynchronously and we need to load the data after the component is fully loaded.
		setTimeout( props.onLoad );
	}, [] );

	return (
		<Fragment>
			{
				props.isPremium
					? <Slot
						name={
							"YoastTwitterPremium" +
							`${ props.location.charAt( 0 ).toUpperCase() + props.location.slice( 1 ) }`
						}
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
	onLoad: PropTypes.func.isRequired,
	location: PropTypes.string,
};

TwitterWrapper.defaultProps = {
	location: "",
};
