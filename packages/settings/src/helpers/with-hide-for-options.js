import { createHigherOrderComponent } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import { isArray, some } from "lodash";
import { PropTypes } from "prop-types";
import { REDUX_STORE_KEY } from "../constants";

/**
 * A simple Hide component.
 *
 * @param {Object} props The components props.
 * @param {boolean} props.isVisible Whether the children should be visible.
 * @param {*} props.children The contents to optionally hide.
 *
 * @returns {JSX.Element} The Hide component.
 */
function Hide( { isVisible, children } ) {
	if ( ! isVisible ) {
		return null;
	}

	return <>{ children }</>;
}

Hide.propTypes = {
	isVisible: PropTypes.bool,
	children: PropTypes.node.isRequired,
};

Hide.defaultProps = {
	isVisible: true,
};

/**
 * Determines whether the component should be visible, based on the optionPath or dataPath.
 *
 * When the optionPath is an array it will hide only when all the option values are false.
 *
 * @param {function} getOption The selector to call with the optionPath.
 * @param {string|string[]} optionPath The optionPath or array of optionPaths to check.
 * @param {string} dataPath The dataPath, used when there is no optionPath.
 *
 * @returns {boolean} True when the component should be visible.
 */
function getIsVisible( getOption, { optionPath, dataPath } ) {
	let optionPaths = optionPath;

	if ( ! isArray( optionPaths ) ) {
		// Wrap in an array, use dataPath as fallback.
		optionPaths = [ optionPath || dataPath ];

		// Edge-case safety: if the dataPath is falsy too, fallback to being visible.
		if ( ! optionPaths[ 0 ] ) {
			return true;
		}
	}

	// Any of the options having an option is good enough to show. Ignoring unknown options (passing default: false).
	return some( optionPaths, ( path ) => getOption( path, false ) );
}

/**
 * Creates a higher-order component that can hide.
 *
 * - Uses the optionPath prop to fetch the option value from the store. Using the dataPath prop as fallback.
 * - Supports optionPath as an array, which will then hide if there are no truthy option values.
 * - Usable as a compose function. Or call it to use as a wrapper function.
 *
 * @returns {WPComponent} The wrapped component.
 */
export default function withHideForOptions() {
	return createHigherOrderComponent(
		( WrappedComponent ) =>
			/* eslint-disable-next-line react/display-name -- the surrounding wrapper has a name. */
			( ownProps ) => {
				const isVisible = useSelect(
					( select ) => getIsVisible( select( REDUX_STORE_KEY ).getOption, ownProps ),
					[
						ownProps.optionPath,
						ownProps.dataPath,
					],
				);

				return (
					<Hide isVisible={ isVisible }>
						<WrappedComponent { ...ownProps } />
					</Hide>
				);
			},
		"withHideForOptions",
	);
}
