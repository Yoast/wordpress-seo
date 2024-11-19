import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Tooltip, useToggleState } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

const variants = {
	i: {
		title: __( "Informational", "wordpress-seo" ),
		description: __( "The user wants to find an answer to a specific question.", "wordpress-seo" ),
	},
	n: {
		title: __( "Navigational", "wordpress-seo" ),
		description: __( "The user wants to find a specific page or site.", "wordpress-seo" ),
	},
	c: {
		title: __( "Commercial", "wordpress-seo" ),
		description: __( "The user wants to investigate brands or services.", "wordpress-seo" ),
	},
	t: {
		title: __( "Transactional", "wordpress-seo" ),
		description: __( "The user wants to complete an action (conversion).", "wordpress-seo" ),
	},
};

/**
 *
 * @param {string} value The initial of the intent, can be i,n,c or t only.
 * @param {string} className The class name.
 *
 * @returns {JSX.Element} The colored initial badge.
 */
export const IntentBadge = ( { value, className = "" } ) => {
	const [ isVisible, , , handleMouseEnter, handleMouseLeave ] = useToggleState( false );

	if ( ! variants[ value ] ) {
		return null;
	}

	return (
		<span
			aria-description={ `${ variants[ value ].title }, ${ variants[ value ].description }` }
			className={
				classNames(
					"yst-intent-badge",
					`yst-intent-badge--${ value }`,
					className,
				) }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			{ value.toUpperCase() }

			{ isVisible && <Tooltip className="yst-flex yst-flex-col yst-w-48 yst-text-xs yst-leading-4 yst-font-normal">
				<span className="yst-font-medium">{ variants[ value ].title } </span>
				{ variants[ value ].description }
			</Tooltip> }
		</span>
	);
};

IntentBadge.propTypes = {
	value: PropTypes.oneOf( [ "i", "n", "c", "t" ] ).isRequired,
	className: PropTypes.string,
};

