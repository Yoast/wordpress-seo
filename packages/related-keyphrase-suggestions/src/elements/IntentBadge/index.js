import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
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
 * The intent badge component.
 *
 * @param {string} id The id of the tooltip.
 * @param {string} value The initial of the intent, can be i,n,c or t only.
 * @param {string} className The class name.
 *
 * @returns {JSX.Element} The colored initial badge.
 */
export const IntentBadge = ( { id, value, className = "" } ) => {
	if ( ! variants[ value ] ) {
		return null;
	}

	return (
		<TooltipContainer>
			<TooltipTrigger
				ariaDescribedby={ id } className={
					classNames(
						"yst-intent-badge",
						`yst-intent-badge--${ value }`,
						className,
					) }
			>
				{ value }
			</TooltipTrigger>
			<TooltipWithContext id={ id } className="yst-w-48 yst-text-xs yst-leading-4 yst-font-normal">
				<div className="yst-font-medium">{ variants[ value ].title } </div>
				{ variants[ value ].description }
			</TooltipWithContext>
		</TooltipContainer>
	);
};

IntentBadge.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.oneOf( [ "i", "n", "c", "t" ] ).isRequired,
	className: PropTypes.string,
};

