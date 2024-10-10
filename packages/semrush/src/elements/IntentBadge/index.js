import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Tooltip } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

const variants = {
	i: {
		textColor: "yst-bg-blue-900",
		backgroundColor: "yst-bg-blue-200",
		tooltip: {
			title: __( "Informational", "wordpress-seo" ),
			description: __( "The user wants to find an answer to a specific question.", "wordpress-seo" ),
		},
	},
	n: {
		textColor: "yst-bg-violet-900",
		backgroundColor: "yst-bg-violet-200",
		tooltip: {
			title: __( "Navigational", "wordpress-seo" ),
			description: __( "The user wants to find a specific page or site.", "wordpress-seo" ),
		},
	},
	c: {
		textColor: "yst-bg-amber-900",
		backgroundColor: "yst-bg-amber-200",
		tooltip: {
			title: __( "Commercial", "wordpress-seo" ),
			description: __( "The user wants to investigate brands or services.", "wordpress-seo" ),
		},
	},
	t: {
		textColor: "yst-bg-green-900",
		backgroundColor: "yst-bg-green-200",
		tooltip: {
			title: __( "Transactional", "wordpress-seo" ),
			description: __( "The user wants to complete an action (conversion).", "wordpress-seo" ),
		},
	},
};

/**
 *
 * @param {string} initial The initial of the intent.
 *
 * @returns {wp.Element} The colored initial badge.
 */
const IntentBadge = ( { initial } ) => {
	const [ isVisible, setIsVisible ] = useState( false );
	const handleMouseEnter = useCallback(
		() => setIsVisible( true ),
		[ setIsVisible ],
	);
	const handleMouseLeave = useCallback(
		() => setIsVisible( false ),
		[ setIsVisible ],
	);


	if ( ! variants[ initial ] ) {
		return null;
	}

	const randomId = `id-${ initial }-${ Math.random().toString( 36 ).substring( 7 ) }`;

	return (
		<div
			aria-describedby={ randomId }
			className={
				classNames(
					"yst-w-5 yst-h-5 yst-flex yst-items-center yst-justify-center yst-font-semibold yst-text-sm yst-relative",
					variants[ initial ].textColor,
					variants[ initial ].backgroundColor,
				) }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			{ initial.toUpperCase() }

			{ isVisible && <Tooltip id={ randomId } className="yst-flex yst-flex-col yst-max-w-[180px] yst-text-[11px] yst-leading-4 yst-font-normal">
				<span className="yst-font-medium">{ variants[ initial ].tooltip.title } </span>
				{ variants[ initial ].tooltip.description }
			</Tooltip> }
		</div>
	);
};

IntentBadge.propTypes = {
	initial: PropTypes.oneOf( [ "i", "n", "c", "t" ] ).isRequired,
};

export default IntentBadge;
