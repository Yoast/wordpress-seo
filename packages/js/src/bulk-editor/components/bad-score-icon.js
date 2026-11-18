import { ScoreIcon } from "@yoast/ui-library";

/**
 * The red "needs improvement" score dot shown before a smart-select item's label.
 *
 * @returns {JSX.Element} The score dot.
 */
export const BadScoreIcon = () => <ScoreIcon score="bad" isEmoji={ false } className="yst-h-3 yst-w-3" />;
