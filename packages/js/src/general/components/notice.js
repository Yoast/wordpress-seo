import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { STORE_NAME } from "../constants";

/**
 * Renders the notice component.
 *
 * @param {Object} props Component props.
 * @param {string} props.title The notice title.
 * @param {string} props.id The id of the notice.
 * @param {boolean} props.isDismissable Whether the notice is dismissable.
 * @param {string} props.children The content of the notice.
 * @param {string} [props.className=""] The class name to add to the notice.
 *
 * @returns {JSX.Element} The Notice.
 */
export function Notice( { title, id, isDismissable, children, className = "" } ) {
	const { dismissNotice } = useDispatch( STORE_NAME );

	const handleDismiss = useCallback( () => {
		// Dismiss the notice after the rest of the call stack has been processed.
		setTimeout( () => {
			dismissNotice( id );
		}, 0 );
	}, [ dismissNotice, id ] );

	return (
		<div id={ id } className={ classNames( "yst-p-3 yst-rounded-md yoast-general-page-notice yst-relative", className ) }>
			<div className="yst-flex yst-flex-row yst-items-center yst-min-h-[24px]">
				<span className="yoast-icon" />
				{ title && <div className="yst-text-sm yst-font-medium" dangerouslySetInnerHTML={ { __html: title } } /> }
				{ isDismissable && (
					<button type="button" className="notice-dismiss" onClick={ handleDismiss }>
						<span className="yst-sr-only">
							{
								/* translators: Hidden accessibility text. */
								__( "Close", "wordpress-seo" )
							}
						</span>
					</button>
				) }
			</div>
			{ children && (
				<div className="yst-flex-1 yst-text-sm yst-max-w-[600px] yst-ps-[29px]" dangerouslySetInnerHTML={ { __html: children } } />
			) }
		</div>
	);
}
