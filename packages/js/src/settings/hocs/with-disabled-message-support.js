import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge } from "@yoast/ui-library";
import { get, isEmpty } from "lodash";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";

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
		const disabledSetting = useMemo( () => get( window, `wpseoScriptData.disabledSettings.${ name }`, "" ), [] );
		const isDisabledTracking = useMemo(
			() => name === "wpseo.tracking" && ! isNetworkAdmin && ! isMainSite,
			[ name, isNetworkAdmin, isMainSite ]
		);
		const text = useMemo( () => {
			if ( isDisabledTracking ) {
				return __( "Unavailable for sub-sites", "wordpress-seo" );
			}
			switch ( disabledSetting ) {
				case "multisite":
					return __( "Unavailable for multi-sites", "wordpress-seo" );
				default:
					return __( "Network disabled", "wordpress-seo" );
			}
		}, [ disabledSetting, isDisabledTracking ] );

		if ( ! isEmpty( disabledSetting ) || isDisabledTracking ) {
			return <Component
				name={ name }
				{ ...props }
				disabled={ true }
				labelSuffix={ <Badge variant="plain" size="small" className="yst-ml-1.5">{ text }</Badge> }
			/>;
		}
		return <Component name={ name } { ...props } />;
	};

	WithDisabledMessageSupport.propTypes = {
		name: PropTypes.string.isRequired,
	};

	return WithDisabledMessageSupport;
};

export default withDisabledMessageSupport;
