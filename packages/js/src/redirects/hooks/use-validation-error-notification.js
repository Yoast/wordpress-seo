import { useEffect } from "@wordpress/element";
import { useFormikContext } from "formik";
import useDispatchRedirects from "./use-dispatch-redirects";
import useSelectRedirects from "./use-select-redirects";
import { __ } from "@wordpress/i18n";

/**
 * @returns {void}
 */
const useValidationErrorsNotification = () => {
	const { isValid, errors, isSubmitting } = useFormikContext();
	const { addNotification, removeNotification } = useDispatchRedirects();
	const validationErrorsNotification = useSelectRedirects( "selectNotification", [], "validation-errors" );

	useEffect( () => {
		if ( isValid && validationErrorsNotification ) {
			removeNotification( "validation-errors" );
		}
	}, [ isValid, validationErrorsNotification ] );

	useEffect( () => {
		if ( isSubmitting && ! isValid ) {
			addNotification( {
				id: "validation-errors",
				variant: "error",
				size: "large",
				title: __( "Oh no! It seems your form contains invalid data. Please review the following fields:", "wordpress-seo" ),
			} );
		}
	}, [ isSubmitting, errors, isValid ] );
};

export default useValidationErrorsNotification;
