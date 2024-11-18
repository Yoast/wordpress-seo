import { useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ErrorFallback } from "../../shared-admin/components";

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
export const ElementorErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/elementor-error-support" ), [] );
	const isRtl = useSelect( select => select( "yoast-seo/editor" ).getPreference( "isRtl", false ), [] );

	return (
		<Root context={ { isRtl } }>
			<ErrorFallback error={ error }>
				<ErrorFallback.VerticalButtons
					supportLink={ supportLink }
					handleRefreshClick={ handleRefreshClick }
				/>
			</ErrorFallback>
		</Root>
	);
};

ElementorErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};
