import { NewButton as Button } from "@yoast/components";

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

/**
 * The Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
export function Step( { title, subtitle, finishText, onFinishClick, isFinished, children } ) {
	return (
		<li className={ isFinished ? "finished" : "" }>
			<h4>{ title }</h4>
			{ subtitle && <p>{ subtitle }</p> }
			{ children }
			<hr />
			<Button variant="secondary" onClick={ onFinishClick }>{ finishText }</Button>
		</li>
	);
}
