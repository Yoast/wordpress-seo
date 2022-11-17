import { Transition } from "@headlessui/react";
import { Fragment, useEffect } from "@wordpress/element";
import { Title, usePrevious, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useDocumentTitle } from "../hooks";

/**
 * @returns {JSX.Element} The Route Transition Effect.
 */
const RouteTransitionEffect = () => {
	const { pathname } = useLocation();
	const previousPathname = usePrevious( pathname );
	const [ hasRouteChanged, , , setHasRouteChangedTrue, setHasRouteChangedFalse ] = useToggleState( false );

	useEffect( () => {
		if ( pathname !== previousPathname ) {
			setHasRouteChangedTrue();
		}
	}, [ pathname, previousPathname, setHasRouteChangedTrue ] );

	return (
		<Transition
			as={ Fragment }
			appear={ true }
			show={ hasRouteChanged }
			afterEnter={ setHasRouteChangedFalse }
			enter="yst-transition-opacity yst-duration-150"
			enterFrom="yst-opacity-0"
			enterTo="yst-opacity-50"
			leave="yst-transition-opacity yst-duration-150"
			leaveFrom="yst-opacity-50"
			leaveTo="yst-opacity-0"
		>
			<div className="yst-absolute yst-inset-0 yst-bg-white yst-select-none yst-rounded-lg" />
		</Transition>
	);
};

/**
 * @param {Object} props The properties.
 * @param {JSX.node} children The children.
 * @param {string} title The title.
 * @param {JSX.node} [description] The description.
 * @returns {JSX.Element} The route layout component.
 */
const RouteLayout = ( {
	children,
	title,
	description,
} ) => {
	const documentTitle = useDocumentTitle( { prefix: `${ title } ‹ ` } );
	return (
		<>
			<Helmet>
				<title>{ documentTitle }</title>
			</Helmet>
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ title }</Title>
					{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
				</div>
			</header>
			{ children }
			<RouteTransitionEffect />
		</>
	);
};

RouteLayout.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.node,
};

export default RouteLayout;
