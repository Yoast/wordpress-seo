/* eslint-disable require-jsdoc */
import { useState, useEffect, useMemo } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { reduce, isObject, map, get } from "lodash";
import { useFormikContext } from "formik";
import { Link } from "react-router-dom";
import { STORE_NAME } from "../constants";
import { useSelectSettings } from "../store";

const flattenObject = ( object, parentKey = "" ) => reduce(
	object,
	( acc, value, key ) => {
		if ( isObject( value ) ) {
			return flattenObject( value, key );
		}
		return {
			...acc,
			[ `${parentKey}.${key}` ]: value,
		};
	},
	{}
);

/**
 * @returns {void}
 */
const useValidationErrorsNotification = () => {
	const { submitCount, isValid, errors } = useFormikContext();
	const { addNotification } = useDispatch( STORE_NAME );
	const searchIndex = useSelectSettings( "selectSearchIndex" );
	const [ prevSubmitCount, setPrevSubmitCount ] = useState( 0 );

	const flatErrors = useMemo( () => flattenObject( errors ), [ errors ] );
	const description = useMemo( () => map( flatErrors, ( value, key ) => {
		return <>
			<Link to={ `${ get( searchIndex, `${key}.route`, "404" ) }#${ get( searchIndex, `${key}.fieldId`, "" ) }` }>
				{ `${get( searchIndex, `${key}.fieldLabel`, "" )}:` }
			</Link>
            &nbsp;
			{ value }
		</>;
	} ), [ flatErrors, searchIndex ] );

	useEffect( () => {
		if ( ! isValid && submitCount > prevSubmitCount ) {
			addNotification( {
				id: `validation-errors-${submitCount}`,
				variant: "error",
				size: "large",
				title: __( "Oh no! It seems your form contains invalid data. Please review the following fields to get that sorted:", "wordpress-seo" ),
				description,
			} );
			setPrevSubmitCount( submitCount );
		}
	}, [ submitCount, errors ] );
};

export default useValidationErrorsNotification;
