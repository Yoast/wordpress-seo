import { useFormikContext } from "formik";
import { useMemo } from "@wordpress/element";
import { get } from "lodash";

/**
 * @param {Object} props The props.
 * @param {string} name The field name.
 * @returns {{ error, isTouched, message }} The Formik error state.
 */
const useFormikError = ( { name } ) => {
	const { touched, errors } = useFormikContext();
	const isTouched = useMemo( () => get( touched, name, false ), [ touched ] );
	const error = useMemo( () => get( errors, name, "" ), [ errors ] );

	return { isTouched, error };
};

export default useFormikError;
