import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import PropTypes from "prop-types";
import { useSelectSettings } from "../store";

/**
 * Adds disabled message support around a component.
 * @param {JSX.ElementClass} Component The component.
 * @returns {JSX.ElementClass} The wrapped component.
 */
const withDisabledMessageSupport = ( Component ) => {
	/**
	 * @param {string} name The field name.
	 * @param {Object} props The props.
	 * @returns {JSX.Element} The element.
	 */
	const WithDisabledMessageSupport = ( { name, ...props } ) => {
		const isNetworkAdmin = useSelectSettings( "selectPreference", [], "isNetworkAdmin" );
		const isMainSite = useSelectSettings( "selectPreference", [], "isMainSite" );
		const isDisabledSetting = useMemo( () => get( window, `wpseoScriptData.disabledSettings.${ name }`, false ), [] );
		const isDisabledTracking = useMemo( () => name === "wpseo.tracking" && ! isNetworkAdmin && ! isMainSite, [ name, isNetworkAdmin, isMainSite ] );
		const text = useMemo( () => {
			if ( isDisabledTracking ) {
				return __( "This feature has been disabled since subsites never send tracking data.", "wordpress-seo" );
			}
			return __( "This feature has been disabled by the network admin.", "wordpress-seo" );
		}, [ isDisabledTracking ] );

		if ( isDisabledSetting || isDisabledTracking ) {
			return <div>
				<Component name={ name } { ...props } disabled={ true } />
				<p className="yst-mt-2 yst-italic">{ text }</p>
			</div>;
		}
		return <Component name={ name } { ...props } />;
	};

	WithDisabledMessageSupport.propTypes = {
		name: PropTypes.string.isRequired,
	};

	return WithDisabledMessageSupport;
};

export default withDisabledMessageSupport;
