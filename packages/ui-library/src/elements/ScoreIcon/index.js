import React from "react";
import { EmojiNeutralIcon, EmojiSadIcon, EmojiHappyIcon, CircleSolidIcon } from "./icons";
import classNames from "classnames";
import useSvgAria from "../../hooks/use-svg-aria";

/**
 * ScoreIcon component that displays an emoji or circle with a color based on the provided score.
 *
 * @param {string} score The score to display, can be "good", "bad", or "ok".
 * @param {boolean} [isEmoji=true] A flag to indicate if the score should be displayed as an emoji.
 * @param {string} [className] A class name to apply to the icon component.
 * @returns {JSX.Element} The ScoreIcon component.
 */
export const ScoreIcon = ( { score, isEmoji = true, className } ) => {
	const svgAriaProps = useSvgAria();
	const emojiMap = {
		good: EmojiHappyIcon,
		bad: EmojiSadIcon,
		ok: EmojiNeutralIcon,
	};

	const colorMap = {
		good: "yst-good-score",
		bad: "yst-bad-score",
		ok: "yst-ok-score",
	};

	if ( ! isEmoji || ! ( score in emojiMap ) ) {
		return <CircleSolidIcon
			{ ...svgAriaProps }
			className={ classNames(
				"yst-score-icon",
				( score in colorMap ) ? colorMap[ score ] : "yst-text-slate-300",
				className ) }
		/>;
	}

	const EmojiComponent = emojiMap[ score ];

	return <EmojiComponent
		{ ...svgAriaProps }
		className={ classNames( "yst-score-icon", className ) }
	/>;
};
