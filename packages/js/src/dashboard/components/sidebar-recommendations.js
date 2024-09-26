import { useEffect, useState, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { AcademyUpsellCard, PremiumUpsellCard } from "../../shared-admin/components";
import { useSelectDashboard } from "../hooks";
/**
 * @returns {JSX.Element} The sidebar recommendations.
 */
const SidebarRecommendations = ( { position } ) => {
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );
	const promotions = useSelectDashboard( "selectPreference", [], "promotions", [] );
	const premiumLink = useSelectDashboard( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectDashboard( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectDashboard( "selectLink", [], "https://yoa.st/3t6" );
	if ( isPremium ) {
		return null;
	}

	const [ sidebarPosition, setSidebarPosition ] = useState( {} );
	const [ scrollY, setScrollY ] = useState( 0 );

	const updatePosition = useCallback( () => {
		setScrollY( window.scrollY );
	}, [ setScrollY ] );

	useEffect( () => {
		if ( ! position?.top ) {
			return;
		}

		if ( position.top > scrollY ) {
			setSidebarPosition( { top: position.top - scrollY } );
		} else {
			setSidebarPosition( { top: "64px" } );
		}
	}, [ scrollY ] );

	useEffect( () => {
		setScrollY( window.scrollY );
		window.addEventListener( "scroll", updatePosition );
		window.addEventListener( "resize", updatePosition );
		return () => {
			window.removeEventListener( "scroll", updatePosition );
			window.removeEventListener( "resize", updatePosition );
		};
	}, [] );

	return (
		<div className="xl:yst-max-w-3xl xl:yst-fixed xl:yst-right-8 xl:yst-w-[16rem]" style={ sidebarPosition }>
			<div className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-1 yst-gap-4">
				<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } promotions={ promotions } />
				<AcademyUpsellCard link={ academyLink } />
			</div>
		</div>
	);
};

SidebarRecommendations.propTypes = {
	position: PropTypes.shape( {
		top: PropTypes.number,
	} ),
};

export default SidebarRecommendations;
