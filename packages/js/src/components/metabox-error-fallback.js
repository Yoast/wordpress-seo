import { useSelect } from "@wordpress/data";
import { useCallback, useEffect } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { disableMetaboxTabs } from "../helpers/disableMetaboxTabs";
import { ErrorFallback } from "../shared-admin/components";
import ScoreIconPortal from "./portals/ScoreIconPortal";

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
export const MetaboxErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/metabox-error-support" ), [] );
	const isRtl = useSelect( select => select( "yoast-seo/editor" ).getPreference( "isRtl", false ), [] );

	useEffect( () => {
		disableMetaboxTabs();
	}, [] );

	return (
		<Root context={ { isRtl } }>
			<ErrorFallback error={ error }>
				<ErrorFallback.HorizontalButtons
					supportLink={ supportLink }
					handleRefreshClick={ handleRefreshClick }
				/>
				<ScoreIconPortal
					target="wpseo-seo-score-icon"
					scoreIndicator={ "not-set" }
				/>
				<ScoreIconPortal
					target="wpseo-readability-score-icon"
					scoreIndicator={ "not-set" }
				/>
				<ScoreIconPortal
					target="wpseo-inclusive-language-score-icon"
					scoreIndicator={ "not-set" }
				/>
			</ErrorFallback>
		</Root>
	);
};

MetaboxErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};
