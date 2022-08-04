/* eslint-disable require-jsdoc */
import { useState, useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { reduce, isObject } from "lodash";
import { useFormikContext } from "formik";
import { STORE_NAME } from "../constants";
import { useSelectSettings } from "../store";

// const flattenErrors = errors => reduce( errors, ( acc, value, name ) => {
// 	if ( isObject( value ) ) {
// 		return {
// 			...acc,

// 		};
// 		reduce( value, ( nestedValue, nestedName ) => {
// 			formData.set( `${ name }[${ nestedName }]`, nestedValue );
// 		} );
// 	}
// 	return {
// 		...acc,
// 		[ name ]: value,
// 	};
// } );

/**
 * @returns {void}
 */
const useValidationErrorsNotification = () => {
	const { submitCount, isValid, errors } = useFormikContext();
	const { addNotification } = useDispatch( STORE_NAME );
	const searchIndex = useSelectSettings( "selectSearchIndex" );
	const [ prevSubmitCount, setPrevSubmitCount ] = useState( 0 );

	useEffect( () => {
		if ( ! isValid && submitCount > prevSubmitCount ) {
			addNotification( {
				variant: "error",
				size: "large",
				title: __( "Whoops! Your form contains the following invalid fields:", "wordpress-seo" ),
				description: [
					"this field is wrong",
					"this field is also wrong",
				],
			} );
			setPrevSubmitCount( submitCount );
		}
	}, [ submitCount, errors ] );
};

export default useValidationErrorsNotification;
