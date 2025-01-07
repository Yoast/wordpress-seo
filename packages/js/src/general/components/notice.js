import { useCallback } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { XIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * Renders the notice component.
 *
 * @param {string} type The title of the notice.
 * @param {string} id The id of the notice.
 * @param {boolean} isDismissable Whether the notice is dismissable.
 * @param {string} children The content of the notice.
 * @param {string} [className] The class name to add to the notice.
 *
 * @returns {React.Component} The Notice.
 */
export function Notice( { title, id, isDismissable, children, className } ) {
	const ariaSvgProps = useSvgAria();
	const { dismissNotice } = useDispatch( STORE_NAME );

	const handleDismiss = useCallback( () => {
		// Dismiss the notice after the rest of the call stack has been processed.
		setTimeout( () => {
			dismissNotice( id );
		}, 0 );
	}, [ dismissNotice, id ] );

	return (
		<div id={ id } className={ classNames( "yst-p-3 yst-rounded-md yoast-general-page-notice", className ) }>
			<div className="yst-flex yst-flex-row yst-items-center yst-min-h-[24px]">
				<span className="yoast-icon" />
				{ title && <div className="yst-text-sm yst-font-medium" dangerouslySetInnerHTML={ { __html: title } } /> }
				{ isDismissable &&
					<div className="yst-relative yst-ms-auto">
						<button
							type="button"
							className="notice-dismiss"
							onClick={ handleDismiss }
						>
							<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
							<XIcon className="yst-h-5 yst-w-5" { ...ariaSvgProps } />
						</button>
					</div>
				}
			</div>
			{ children && (
				<div className="yst-flex-1 yst-text-sm yst-max-w-[600px] yst-ps-[29px]" dangerouslySetInnerHTML={ { __html: children } } />
			) }
		</div>
	);
}

Notice.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	isDismissable: PropTypes.bool.isRequired,
	children: PropTypes.string.isRequired,
	className: PropTypes.string,
};
