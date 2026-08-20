import { ScoreIcon, Button } from "@yoast/ui-library";
import { __, _n, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import classNames from "classnames";

/**
 * The ImageAltNotice component displays a notice about the image alt text.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onClick - The function to call when the notice is clicked.
 * @param {number} props.numberOfImagesMissingAlt - The number of images missing alt text.
 *
 * @returns {JSX.Element} The image alt notice component.
 */
export const ImageAltNotice = ( { onClick, numberOfImagesMissingAlt, className } ) => {
	return (
		<div className={ classNames( "yst-bg-slate-50 yst-border yst-border-slate-200 yst-rounded-md yst-p-4", className ) }>
			<div className="yst-flex yst-gap-4 yst-justify-between">
				<ScoreIcon score="bad" />
				<div>
					<div className="yst-mb-2">
						{ __( "SEO analysis", "wordpress-seo" ) }: <b>{ __( "Needs improvement", "wordpress-seo" ) }</b>
					</div>
					<p className="yst-text-slate-600 yst-mb-2 yst-p-0">
						{
							safeCreateInterpolateElement(
								sprintf(
								/* translators: %s is the number of images missing alt text, wrapped in bold tags. */
									_n(
										"<b>%s</b> Product image is missing alt text. Screen readers and search engines can’t describe it.",
										"<b>%s</b> Product images are missing alt text. Screen readers and search engines can’t describe them.",
										numberOfImagesMissingAlt,
										"wordpress-seo"
									),
									numberOfImagesMissingAlt
								),
								{ b: <b /> }
							)
						}
					</p>
					<Button
						variant="ai-secondary"
						className="yst-bg-white"
						onClick={ onClick }
					>
						{ __( "Generate image alt text", "wordpress-seo" ) }
					</Button>
				</div>
			</div>
		</div>
	);
};
