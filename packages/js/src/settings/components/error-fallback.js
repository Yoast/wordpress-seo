import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { ErrorFallback as BaseErrorFallback } from "../../shared-admin/components";
import { useSelectSettings } from "../hooks";

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
export const ErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelectSettings( "selectLink", [], "https://yoa.st/settings-error-support" );

	return (
		<BaseErrorFallback error={ error }>
			<BaseErrorFallback.HorizontalButtons
				supportLink={ supportLink }
				handleRefreshClick={ handleRefreshClick }
			/>
		</BaseErrorFallback>
	);
};

ErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};
