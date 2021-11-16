import { NewButton as Button } from "@yoast/components";
import { ReactComponent as ArrowDown } from "../../../images/icon-arrow-down.svg";
import PropTypes from "prop-types";

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
 * Returns a finish step section.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The FinishStepSection element.
 */
export function FinishStepSection( { onFinishClick, finishText, hasDownArrow, isFinished } ) {
	return (
		<>
			<hr />
			<Button className={ `yoast-button yoast-button--secondary${ isFinished ? " yoast-button--finished" : "" }` } onClick={ onFinishClick }>
				{ finishText }
				{ hasDownArrow && <ArrowDown className="yoast-button--arrow-down" /> }
			</Button>
		</>
	);
}

FinishStepSection.propTypes = {
	finishText: PropTypes.string.isRequired,
	onFinishClick: PropTypes.func.isRequired,
	hasDownArrow: PropTypes.bool,
	isFinished: PropTypes.bool,
};

FinishStepSection.defaultProps = {
	hasDownArrow: false,
	isFinished: false,
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
