import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * Renders the notice component.
 *
 * @param {JSX.node} type The title of the notice.
 * @param {string} id The id of the notice.
 * @param {JSX.node} button The button of the notice.
 * @param {JSX.node} children The content of the notice.
 *
 * @returns {React.Component} The Notice.
 */
export default function Notice( { title, id, button, children } ) {
	return (
		<div id={ id } className={ classNames( "yst-p-4 yst-rounded-md yoast-dashboard-notice" ) }>
			<div className={ classNames( "yst-flex yst-flex-row yst-items-center yst-mb-1" ) }>
				<span className="yoast-icon" />
				{ title && <div className="yst-text-sm yst-font-medium" dangerouslySetInnerHTML={ { __html: title.outerHTML } } /> }
				{ button && <div className="yst-relative yst-ml-auto" dangerouslySetInnerHTML={ { __html: button.outerHTML } } /> }
			</div>
			{ children && <div className="yst-flex-1 yst-text-sm yst-px-6 yst-max-w-[600px]" dangerouslySetInnerHTML={ { __html: children.outerHTML } } /> }
		</div>
	);
}

Notice.propTypes = {
	title: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	button: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired,
};
