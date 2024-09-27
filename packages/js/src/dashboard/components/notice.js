import PropTypes from "prop-types";
import classNames from "classnames";
import { XIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";

/**
 * Renders the notice component.
 *
 * @param {string} type The title of the notice.
 * @param {string} id The id of the notice.
 * @param {boolean} isDismissable Whether the notice is dismissable.
 * @param {string} children The content of the notice.
 *
 * @returns {React.Component} The Notice.
 */
export default function Notice( { title, id, isDismissable, children } ) {
	const ariaSvgProps = useSvgAria();

	return (
		<div id={ id } className={ classNames( "yst-p-3 yst-rounded-md yoast-dashboard-notice" ) }>
			<div className={ classNames( "yst-flex yst-flex-row yst-items-center yst-min-h-[24px]" ) }>
				<span className="yoast-icon" />
				{ title && <div className="yst-text-sm yst-font-medium" dangerouslySetInnerHTML={ { __html: title } } /> }
				{ isDismissable &&
					<div className="yst-relative yst-ml-auto">
						<button
							type="button"
							className="notice-dismiss"
						>
							<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
							<XIcon className="yst-h-5 yst-w-5" { ...ariaSvgProps } />
						</button>
					</div>
				}
			</div>
			{ children && <div className="yst-flex-1 yst-text-sm yst-max-w-[600px] yst-pl-[29px]" dangerouslySetInnerHTML={ { __html: children } } /> }
		</div>
	);
}

Notice.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	isDismissable: PropTypes.bool.isRequired,
	children: PropTypes.string.isRequired,
};
