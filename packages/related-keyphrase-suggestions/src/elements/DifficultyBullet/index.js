import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { __ } from "@wordpress/i18n";
import { Tooltip, useToggleState } from "@yoast/ui-library";


const variants = [
	{
		min: 0,
		max: 14,
		name: "very-easy",
		tooltip: {
			title: __( "Very easy", "wordpress-seo" ),
			description: __( "Your chance to start ranking new pages.", "wordpress-seo" ),
		},
	},
	{
		min: 15,
		max: 29,
		name: "easy",
		tooltip: {
			title: __( "Easy", "wordpress-seo" ),
			description: __( "You will need quality content focused on the keyword’s intent.", "wordpress-seo" ),
		},
	},
	{
		min: 30,
		max: 49,
		name: "possible",
		tooltip: {
			title: __( "Possible", "wordpress-seo" ),
			description: __( "You will need well-structured and unique content.", "wordpress-seo" ),
		},
	},
	{
		min: 50,
		max: 69,
		name: "difficult",
		tooltip: {
			title: __( "Difficult", "wordpress-seo" ),
			description: __( "You will need lots of ref. domains and optimized content.", "wordpress-seo" ),
		},
	},
	{
		min: 70,
		max: 84,
		name: "hard",
		tooltip: {
			title: __( "Hard", "wordpress-seo" ),
			description: __( "You will need lots of high-quality ref. domains and optimized content.", "wordpress-seo" ),
		},
	},
	{
		min: 85,
		max: 100,
		name: "very-hard",
		tooltip: {
			title: __( "Very hard", "wordpress-seo" ),
			description: __( "It will take a lot of on-page SEO, link building, and content promotion efforts.", "wordpress-seo" ),
		},
	},
];

/**
 * Returns the variant of the difficulty.
 *
 * @param {number} value The difficulty index (0-100).
 * @returns {object} The variant of the difficulty.
 */
const getVariant = ( value ) => {
	for ( const variant of variants ) {
		if ( variant.min <= value && value <= variant.max ) {
			return variant;
		}
	}
};


/**
 *
 * @param {number} value The index of difficulty (0-100).
 *
 * @returns {JSX.Element} The percentage of difficulty with a bullet with matching color.
 */
export const DifficultyBullet = ( { value } ) => {
	const [ isVisible, , , handleMouseEnter, handleMouseLeave ] = useToggleState( false );

	const variant = getVariant( value );

	if ( ! variant ) {
		return null;
	}

	return (
		<div
			aria-description={ `${ variant.tooltip.title }, ${ variant.tooltip.description }` }
			className="yst-flex yst-gap-2 yst-items-center yst-relative yst-w-10"
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<div className="yst-text-right yst-w-5">
				{ value }
			</div>
			<div
				className={
					classNames(
						"yst-w-3 yst-h-3 yst-rounded-full",
						`yst-difficulty--${ variant.name }`,
					) }
			/>

			{ isVisible && <Tooltip
				className="yst-flex yst-flex-col yst-w-48 yst-text-xs yst-leading-4 yst-font-normal"
				position="left"
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

