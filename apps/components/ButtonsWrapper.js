import React, { Fragment, useState } from "react";
import {
	NewButton as Button,
	ButtonStyledLink,
	CloseButton,
} from "@yoast/components/src/button";

/**
 * Temporary onclick function.
 *
 * @returns {void}
 */
function clickerDiClick() {
	console.log( "You are an exceptional clicker!" );
}

const ButtonWrapper = ( props ) => {
	const [ count, countUp ] = useState( 0 );

	return <Button variant="primary" onClick={ () => countUp( count + 1 ) }>{ `${ props.name }: ${ count }` }</Button>
}

const buttonRef = React.createRef();
const buttonStyledLinkRef = React.createRef();

const focusButtonRef = () => {
	buttonRef.current.focus();
};

const focusLinkRef = () => {
	buttonStyledLinkRef.current.focus();
};

const buttonGrouping = <Fragment>
	<h3>"primary" variant (default)</h3>
	<ButtonWrapper name="Test usestate" />
	<Button onClick={ clickerDiClick } title="Testing whether other props are also passed, like this tooltip">Default button</Button>
	<Button variant="primary" onClick={ clickerDiClick }>Primary button</Button>
	<Button variant="primary" disabled={ true } onClick={ clickerDiClick }>Primary disabled button</Button>
	<Button variant="primary" small={ true } onClick={ clickerDiClick }>Primary small button</Button>
	<Button variant="primary" small={ true } disabled={ true } onClick={ clickerDiClick }>Primary small disabled button</Button>
	<ButtonStyledLink variant="primary" href={ "#" }>Primary link</ButtonStyledLink>
	<ButtonStyledLink variant="primary" small={ true } href={ "#" }>Primary small link</ButtonStyledLink>

	<h3>"secondary" variant</h3>
	<Button variant="secondary" onClick={ clickerDiClick }>Secondary button</Button>
	<Button variant="secondary" disabled={ true } onClick={ clickerDiClick }>Secondary disabled button</Button>
	<Button variant="secondary" small={ true } onClick={ clickerDiClick }>Secondary small button</Button>
	<Button variant="secondary" small={ true }  disabled={ true } onClick={ clickerDiClick }>Secondary small disabled button</Button>
	<ButtonStyledLink variant="secondary" href={ "#" }>Secondary link</ButtonStyledLink>
	<ButtonStyledLink variant="secondary" small={ true } href={ "#" }>Secondary small link</ButtonStyledLink>

	<h3>With Ref!</h3>
	<Button variant="secondary" buttonRef={ buttonRef } small={ true } onClick={ clickerDiClick }>This Button has a Ref!</Button>
	<button onClick={ focusButtonRef }>focus test</button>
	<ButtonStyledLink variant="secondary" buttonRef={ buttonStyledLinkRef } small={ true } href={ "#" }>This ButtonStyledLink has a Ref!</ButtonStyledLink>
	<button onClick={ focusLinkRef }>focus test</button>

	<h3>"buy" variant (or "upsell")</h3>
	<Button variant="upsell" onClick={ clickerDiClick }>Buy button</Button>
	<Button variant="upsell" disabled={ true } onClick={ clickerDiClick }>Buy disabled button</Button>
	<Button variant="upsell" small={ true } onClick={ clickerDiClick }>Buy small button</Button>
	<Button variant="upsell" small={ true } disabled={ true } onClick={ clickerDiClick }>Buy small disabled button</Button>
	<ButtonStyledLink variant="upsell" href="#">Buy Link</ButtonStyledLink>
	<ButtonStyledLink variant="upsell" small={ true } href="#">Buy small Link</ButtonStyledLink>

	<h3>"hide" and "remove" variants</h3>
	<Button variant="hide" onClick={ clickerDiClick }>Hide button</Button>
	<Button variant="remove" onClick={ clickerDiClick }>Remove button</Button>
	<ButtonStyledLink variant="hide" href="#">Hide Link</ButtonStyledLink>
	<ButtonStyledLink variant="remove" href="#">Remove Link</ButtonStyledLink>

	<h3>"edit" variant</h3>
	<Button variant="edit" onClick={ clickerDiClick }>Edit button</Button>
	<ButtonStyledLink variant="edit" href="#">Edit Link</ButtonStyledLink>

	<h3>CloseButton (not a variant due its different characteristics)</h3>
	<CloseButton onClick={ clickerDiClick } />
</Fragment>;

/**
 * Function that displays all the reactified components that we currently have.
 *
 * @returns {*} A div with all reactified components.
 */
const ButtonsWrapper = () => {
	return (
		<div className="yoast">

			<h2>Buttons and ButtonStyledLinks</h2>
			<p>
				The buttons come in some variants, and can be a Button or a link styled as a button.
				They can also be big, or small, and can contain icons before and/or after.
				They also pass regular props, like disabled for buttons.
			</p>
			<div
				style={ {
					padding: "24px",
				} }
			>
				{ buttonGrouping }
			</div>
		</div>
	);
};
export default ButtonsWrapper;
