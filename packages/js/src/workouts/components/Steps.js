import { Fragment } from "@wordpress/element";
import { NewButton as Button } from "@yoast/components";
import { ReactComponent as ArrowDown } from "../../../images/icon-arrow-down.svg";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/**
 * The Steps component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Steps component.
 */
export function Steps( props ) {
	return (
		<ol id={ props.id } className="workflow">
			{ props.children }
		</ol>
	);
}

Steps.propTypes = {
	id: PropTypes.string.isRequired,
	children: PropTypes.any.isRequired,
};

/**
 * Returns a finish button section.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The FinishButtonSection element.
 */
export function FinishButtonSection( {
	stepNumber,
	onFinishClick,
	buttonId,
	finishText,
	hasDownArrow,
	isFinished,
	additionalButtonProps,
	isSaved,
	isReady,
	children,
} ) {
	return (
		<Fragment>
			<hr id={ stepNumber ? `hr-scroll-target-step-${ stepNumber + 1 }` : null } />
			{ children }
			<div className="finish-button-section">
				<Button
					className={ `yoast-button yoast-button--${ isReady ? "primary" : "secondary" }${ isFinished ? " yoast-button--finished" : "" }` }
					onClick={ onFinishClick }
					id={ buttonId }
					{ ...additionalButtonProps }
				>
					{ finishText }
					{ hasDownArrow && <ArrowDown className="yoast-button--arrow-down" /> }
				</Button>
				{ isSaved && <span className="finish-button-saved">{ __( "Saved!", "wordpress-seo" ) }</span> }
			</div>
		</Fragment>
	);
}

FinishButtonSection.propTypes = {
	finishText: PropTypes.string.isRequired,
	onFinishClick: PropTypes.func.isRequired,
	buttonId: PropTypes.string.isRequired,
	stepNumber: PropTypes.number,
	hasDownArrow: PropTypes.bool,
	isFinished: PropTypes.bool,
	additionalButtonProps: PropTypes.object,
	isSaved: PropTypes.bool,
	isReady: PropTypes.bool,
	children: PropTypes.any,
};

FinishButtonSection.defaultProps = {
	stepNumber: NaN,
	hasDownArrow: false,
	isFinished: false,
	additionalButtonProps: {},
	isSaved: false,
	children: null,
	isReady: false,
};

/**
 * The Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
export function Step( { id, title, subtitle, subtitleClass, isFinished, ImageComponent, children } ) {
	const finished = isFinished ? " finished" : "";
	return (
		<li id={ id } className={ `step${finished}` }>
			<h4 id={ `${id}-title` }>{ title }</h4>
			<div id={ `${id}-subtitle` } style={ { display: "flex" } }>
				{ subtitle && <p className={ subtitleClass }>{ subtitle }</p> }
				{ ImageComponent && <ImageComponent style={ { height: "119px", width: "100px", flexShrink: 0 } } /> }
			</div>
			{ children }
		</li>
	);
}

Step.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	subtitle: PropTypes.oneOfType( [ PropTypes.string, PropTypes.object ] ),
	subtitleClass: PropTypes.string,
	isFinished: PropTypes.bool,
	ImageComponent: PropTypes.func,
	children: PropTypes.any.isRequired,
};

Step.defaultProps = {
	subtitle: null,
	subtitleClass: "",
	ImageComponent: null,
	isFinished: false,
};
