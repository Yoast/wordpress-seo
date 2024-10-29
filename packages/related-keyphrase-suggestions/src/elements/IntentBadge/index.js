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
 * @param {string} initial The initial of the intent.
 *
 * @returns {JSX.Element} The colored initial badge.
 */
export const IntentBadge = ( { initial } ) => {
	const [ isVisible, , , handleMouseEnter, handleMouseLeave ] = useToggleState( false );

	if ( ! variants[ initial ] ) {
		return null;
	}

	return (
		<div
			aria-description={ `${ variants[ initial ].title }, ${ variants[ initial ].description }` }
			className={
				classNames(
					"yst-intent-badge",
					`yst-intent-badge--${ initial }`,
				) }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			{ initial.toUpperCase() }

			{ isVisible && <Tooltip className="yst-flex yst-flex-col yst-max-w-[180px] yst-text-[11px] yst-leading-4 yst-font-normal">
				<span className="yst-font-medium">{ variants[ initial ].title } </span>
				{ variants[ initial ].description }
			</Tooltip> }
		</div>
	);
};

IntentBadge.propTypes = {
	initial: PropTypes.oneOf( [ "i", "n", "c", "t" ] ).isRequired,
};

