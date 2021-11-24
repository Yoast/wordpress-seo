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
		<ol className="workflow yoast">
			{ props.children }
		</ol>
	);
}

Steps.propTypes = {
	children: PropTypes.any.isRequired,
};

/**
 * Returns a finish button section.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The FinishButtonSection element.
 */
export function FinishButtonSection( { stepNumber, onFinishClick, finishText, hasDownArrow, isFinished, additionalButtonProps, isSaved, children } ) {
	return (
		<Fragment>
			<hr id={ stepNumber ? `hr-scroll-target-step-${ stepNumber + 1 }` : null } />
			{ children }
			<div className="finish-button-section">
				<Button
					className={ `yoast-button yoast-button--secondary${ isFinished ? " yoast-button--finished" : "" }` }
					onClick={ onFinishClick }
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
	stepNumber: PropTypes.number,
	hasDownArrow: PropTypes.bool,
	isFinished: PropTypes.bool,
	additionalButtonProps: PropTypes.object,
	isSaved: PropTypes.bool,
	children: PropTypes.any,
};

FinishButtonSection.defaultProps = {
	stepNumber: NaN,
	hasDownArrow: false,
	isFinished: false,
	additionalButtonProps: {},
	isSaved: false,
	children: null,
};

/**
 * The Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
export function Step( { title, subtitle, isFinished, ImageComponent, children } ) {
	const finished = isFinished ? " finished" : "";
	return (
		<li className={ `step${finished}` }>
			<h4>{ title }</h4>
			<div style={ { display: "flex" } }>
				{ subtitle && <p>{ subtitle }</p> }
				{ ImageComponent && <ImageComponent style={ { height: "119px", width: "100px", flexShrink: 0 } } /> }
			</div>
			{ children }
		</li>
	);
}

Step.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.oneOfType( [ PropTypes.string, PropTypes.object ] ),
	isFinished: PropTypes.bool,
	ImageComponent: PropTypes.func,
	children: PropTypes.any.isRequired,
};

Step.defaultProps = {
	subtitle: null,
	ImageComponent: null,
	isFinished: false,
};
