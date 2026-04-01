import { __ } from "@wordpress/i18n";
import { EyeIcon, DocumentIcon } from "@heroicons/react/solid";
import { useSvgAria } from "@yoast/ui-library";

/**
 * ContentSuggestionBlock component.
 *
 * @param {Object}   props              The component props.
 * @param {string[]} props.contentNotes The content notes to display.
 *
 * @returns {JSX.Element} The content suggestion block component.
 */
export const ContentSuggestionBlock = ( { contentNotes } ) => {
	const svgAriaProps = useSvgAria();
	return (
		<div className="yst-bg-slate-50 yst-font-sans yst-rounded-sm yst-shadow-sm yst-border yst-border-solid yst-border-slate-200 yst-p-4">
			<div className="yst-text-slate-500 yst-text-xs yst-flex yst-items-center yst-mb-4">
				<EyeIcon className="yst-inline-block yst-w-3 yst-h-3 yst-me-1 yst-shrink-0" { ...svgAriaProps } />
				<span className="yst-text-xs yst-leading-3">{ __( "Only visible to you", "wordpress-seo" ) }</span>
			</div>
			<div>
				<div className="yst-flex yst-justify-start yst-items-center yst-gap-2 yst-mb-1">
					<div className="yst-flex yst-items-center yst-justify-center yst-w-4 yst-h-4 yst-bg-ai-500 yst-rounded-[1.5px]">
						<DocumentIcon className="yst-w-3 yst-h-3 yst-shrink-0 yst-text-white yst-flex yst-items-center yst-justify-center" { ...svgAriaProps } />
					</div>
					<h3 className="yst-text-slate-800 yst-text-sm yst-leading-5 yst-font-medium yst-m-0">{ __( "Content notes", "wordpress-seo" ) }</h3>
				</div>
				{ contentNotes.length > 0 &&
				<ul className="yst-text-sm yst-text-slate-600 yst-font-normal yst-my-0 yst-ps-5 yst-leading-5 yst-list-none">
					{ contentNotes.map( ( note, index ) => (
						<li className="yst-flex yst-justify-start yst-gap-2" key={ `${index}-${note}` }>
							<span aria-hidden="true">•</span>
							{ note }</li>
					) ) }
				</ul>
				}
			</div>
		</div>
	);
};
