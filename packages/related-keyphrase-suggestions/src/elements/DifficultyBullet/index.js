import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { __ } from "@wordpress/i18n";
import { Tooltip } from "@yoast/ui-library";

const veryEasy = {
	name: "very-easy",
	tooltip: {
		title: __( "Very easy", "wordpress-seo" ),
		description: __( "Your chance to start ranking new pages.", "wordpress-seo" ),
	},
};

const easy = {
	name: "easy",
	tooltip: {
		title: __( "Easy", "wordpress-seo" ),
		description: __( "You will need quality content focused on the keyword’s intent.", "wordpress-seo" ),
	},
};

const possible = {
	name: "possible",
	tooltip: {
		title: __( "Possible", "wordpress-seo" ),
		description: __( "You will need well-structured and unique content.", "wordpress-seo" ),
	},
};

const difficult = {
	name: "difficult",
	tooltip: {
		title: __( "Difficult", "wordpress-seo" ),
		description: __( "You will need lots of ref. domains and optimized content.", "wordpress-seo" ),
	},
};

const hard = {
	name: "hard",
	tooltip: {
		title: __( "Hard", "wordpress-seo" ),
		description: __( "You will need lots of high-quality ref. domains and optimized content.", "wordpress-seo" ),
	},
};

const veryHard = {
	name: "very-hard",
	tooltip: {
		title: __( "Very hard", "wordpress-seo" ),
		description: __( "It will take a lot of on-page SEO, link building, and content promotion efforts.", "wordpress-seo" ),
	},
};

const variants = [
	{ min: 0, max: 14, variant: veryEasy },
	{ min: 15, max: 29, variant: easy },
	{ min: 30, max: 49, variant: possible },
	{ min: 50, max: 69, variant: difficult },
	{ min: 70, max: 84, variant: hard },
	{ min: 85, max: 100, variant: veryHard },
];

/**
 * Returns the variant of the difficulty.
 *
 * @param {number} value The percentage of difficulty.
 * @returns {object} The variant of the difficulty.
 */
const getVariant = ( value ) => {
	for ( const { min, max, variant } of variants ) {
		if ( min <= value && value <= max ) {
			return variant;
		}
	}
	throw new Error( "Value out of range" );
};


/**
 *
 * @param {value} value The percentage of difficulty.
 *
 * @returns {JSX.Element} The percentage of difficulty with a bullet with matching color.
 */
const DifficultyBullet = ( { value } ) => {
	const [ isVisible, setIsVisible ] = useState( false );

	const handleMouseEnter = useCallback(
		() => setIsVisible( true ),
		[ setIsVisible ],
	);

	const handleMouseLeave = useCallback(
		() => setIsVisible( false ),
		[ setIsVisible ],
	);

	const variant = getVariant( value );

	const variantClass = `yst-difficulty-${ variant.name }`;

	return (
		<div
			aria-label={ `${ variant.tooltip.title }, ${ variant.tooltip.description }` }
			className="yst-flex yst-gap-2 yst-items-center yst-relative"
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<div className="yst-w-5 yst-flex yst-justify-end">
				{ value }
			</div>
			<div
				className={
					classNames(
						"yst-w-[11px] yst-h-[11px] yst-rounded-full",
						variantClass,
					) }
			/>

			{ isVisible && <Tooltip
				className="yst-flex yst-flex-col yst-max-w-[180px] yst-text-[11px] yst-leading-4 yst-font-normal"
			>
				<span className="yst-font-medium">{ variant.tooltip.title } </span>
				{ variant.tooltip.description }
			</Tooltip> }

		</div>
	);
};

DifficultyBullet.propTypes = {
	value: PropTypes.number.isRequired,
};

export default DifficultyBullet;
