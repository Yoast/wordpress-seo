import classNames from "classnames";
import { PropTypes } from "prop-types";

/**
 * The Section Component.
 *
 * @param {String} [title=""] The title of the section.
 * @param {String} [description=""] The description of the section.
 * @param {string} [className=""] Additional CSS class name
 * @param {*} children The content of the section.
 *
 * @returns {Component} The Section component.
 */
export default function Section( { title, description, className, children } ) {
	return (
		<section className={ classNames( "yst-section", className ) }>
			{ title && <div className="yst-col-span-1 yst-max-w-screen-sm yst-mb-8 lg:yst-mb-0">
				<h2 className="yst-text-base yst-mb-2">{ title }</h2>
				{ description && <p>{ description }</p> }
			</div> }

			<div className="yst-col-span-2 yst-max-w-screen-sm">
				{ children }
			</div>
		</section>
	);
}

Section.propTypes = {
	title: PropTypes.string,
	description: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

Section.defaultProps = {
	title: "",
	description: "",
	className: "",
};
