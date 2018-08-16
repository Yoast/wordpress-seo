import { stripHTML } from "../../../helpers/stringHelpers";

const { renderToString } = window.wp.element;
const { RichText } = window.wp.editor;

let LegacyHowToStep = ( props ) => {
	return <RichText.Content
		tagName="li"
		className="schema-how-to-step"
		key={ props.id }
		value={ props.contents }
	/>;
};

export default function ( props ) {
	let { steps, title, hasDuration, hours, minutes, description, unorderedList, additionalListCssClasses, className } = props;

	steps = steps ? steps.map( ( step ) => <LegacyHowToStep { ...step } key={ step.id } /> ) : null;

	const classNames = [ "schema-how-to", className ].filter( ( i ) => i ).join( " " );
	const listClassNames = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( i ) => i ).join( " " );

	return (
		<div className={ classNames }>
			<RichText.Content
				tagName="h2"
				className="schema-how-to-title"
				value={ title }
				id={ stripHTML( renderToString( title ) ).toLowerCase().replace( /\s+/g, "-" ) }
			/>
			{ ( hasDuration ) &&
			<p className="schema-how-to-total-time">
				{ __( "Total time:", "wordpress-seo" ) }
				&nbsp;
				{ hours || 0 }:{ ( "00" + ( minutes || 0 ) ).slice( -2 ) }
			</p>
			}ß
			<RichText.Content
				tagName="p"
				className="schema-how-to-description"
				value={ description }
			/>
			{ unorderedList
				? <ul className={ listClassNames }>{ steps }</ul>
				: <ol className={ listClassNames }>{ steps }</ol>
			}
		</div>
	);
}