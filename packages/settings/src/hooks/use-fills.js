import { Fill } from "@wordpress/components";
import { useCallback, useState } from "@wordpress/element";
import globalApp from "../initializers/global-app";
import PropTypes from "prop-types";

/**
 * Wraps JSX in order to handle the renderPriority prop.
 *
 * @param {JSX.node} children JSX to wrap.
 *
 * @returns {JSX.Element} Wrapped component.
 */
function RenderPriority( { children } ) {
	return (
		<>{ children }</>
	);
}

RenderPriority.propTypes = {
	// eslint-disable-next-line react/no-unused-prop-types
	renderPriority: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
};

/**
 * A React hook for handling fills.
 *
 * @returns {Object} An object containing the fills.
 */
export default function useFills() {
	const [ fills, setFills ] = useState( [] );

	/**
	 * Renders the component inside the named fill.
	 *
	 * @param {string} name The name of the slot to fill.
	 * @param {JSX.Component} Component The component to render in the slot.
	 * @param {number} priority The priority of the fill. Defaults to 10.
	 *
	 * @returns {void}
	 */
	globalApp.registerFill = useCallback( ( name, Component, priority = 10 ) => {
		setFills( [
			...fills,
			<Fill key={ `fill-${ name }-${ fills.length }` } name={ name }>
				<RenderPriority renderPriority={ priority }>
					<Component />
				</RenderPriority>
			</Fill>,
		] );
	}, [ fills ] );

	return {
		fills,
	};
}
