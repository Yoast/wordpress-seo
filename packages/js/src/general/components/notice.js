import { XIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";

/**
 * Renders the notice component.
 *
 * @param {string} type The title of the notice.
 * @param {string} id The id of the notice.
 * @param {boolean} isDismissable Whether the notice is dismissable.
 * @param {string} children The content of the notice.
 * @param {function} onDismiss The dismiss handler.
 *
 * @returns {React.Component} The Notice.
 */
export function Notice( { title, id, isDismissable, children, onDismiss } ) {
	const ariaSvgProps = useSvgAria();

	const handleClick = useCallback( () => {
		onDismiss( id );
	}, [ onDismiss, id ] );

	return (
		<div id={ id } className={ classNames( "yst-p-3 yst-rounded-md yoast-general-page-notice" ) }>
			<div className={ classNames( "yst-flex yst-flex-row yst-items-center yst-min-h-[24px]" ) }>
				<span className="yoast-icon" />
				{ title && <div className="yst-text-sm yst-font-medium" dangerouslySetInnerHTML={ { __html: title } } /> }
				{ isDismissable &&
					<div className="yst-relative yst-ml-auto">
						<button
							type="button"
							className="notice-dismiss"
							onClick={ handleClick }
						>
							<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
							<XIcon className="yst-h-5 yst-w-5" { ...ariaSvgProps } />
						</button>
					</div>
				}
			</div>
			{ children && (
				<div className="yst-flex-1 yst-text-sm yst-max-w-[600px] yst-pl-[29px]" dangerouslySetInnerHTML={ { __html: children } } />
			) }
		</div>
	);
}

Notice.defaultProps = {
	onDismiss: noop,
};

Notice.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	isDismissable: PropTypes.bool.isRequired,
	children: PropTypes.string.isRequired,
	onDismiss: PropTypes.func,
};
