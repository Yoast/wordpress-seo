import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { ReplacementVariableEditor } from "@yoast/replacement-variable-editor";
import { PropTypes } from "prop-types";

import { REDUX_STORE_KEY } from "../constants";
import { getReplacevarsForEditor } from "../helpers/apply-replacevars";

/**
 * A wrapper component that can render either a title or description replacement variable editor, or both.
 *
 * @param {Object} props The props object.
 *
 * @returns {JSX.Element} A title and/or a description ReplacementVariableEditor
 */
function ReplacementVariableFields( props ) {
	return (
		<>
			{ props.showTitle && <ReplacementVariableEditor
				{ ...props.titleProps }
				onChange={ props.onTitleChange }
			/> }
			{ props.showDescription && <ReplacementVariableEditor
				{ ...props.descriptionProps }
				onChange={ props.onDescriptionChange }
			/> }
		</>
	);
}

ReplacementVariableFields.propTypes = {
	showTitle: PropTypes.bool,
	showDescription: PropTypes.bool,
	titleProps: PropTypes.object.isRequired,
	descriptionProps: PropTypes.object.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
};

ReplacementVariableFields.defaultProps = {
	showTitle: true,
	showDescription: true,
};

/**
 * The container connecting the ReplacementVariableFields component to the store.
 *
 * @param {Object} props The props to pass to the ReplacementVariableFields component.
 *
 * @returns {JSX.Element} The connected ReplacementVariableFields component.
 */
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { getData } = select( REDUX_STORE_KEY );

		const {
			dataPath,
			fieldIds = {},
			labels = {},
			showTitle = true,
			showDescription = true,
			scope = "",
			supportedVariables = [],
		} = ownProps;

		const replacementVariables = getReplacevarsForEditor( { scope, supportedVariables } );

		const commonProps = {
			replacementVariables,
			recommendedReplacementVariables: replacementVariables.map( replacevar => replacevar.name ),
		};

		let titleProps = {};
		if ( showTitle ) {
			titleProps = {
				...commonProps,
				type: "title",
				content: getData( dataPath + ".title", "" ) || "",
				fieldId: fieldIds.title,
				label: labels.title,
			};

			/*
			 Preemptively add a space at the end.
			 Adding a space is a thing that the replacement variable editor does to auto-separate after a variable.
			 If we don't do that in our original data, it will trigger an update and then a save prompt.
			 Adding a space here will prevent this scenario, there is no need to actually save the space.
			 Being precise here is important, because otherwise a space is added when the user types `%%` and the editor
			 resets its focus because unexpected content was received. E.g. only add a space when it is `%%sitename%%`,
			 not when it is only `%%` or `%%sitename`.
			 */
			if ( titleProps.content.match( /%%\w+%%$/ ) ) {
				titleProps.content += " ";
			}
		}

		let descriptionProps = {};
		if ( showDescription ) {
			descriptionProps = {
				...commonProps,
				type: "description",
				content: getData( dataPath + ".description", "" ) || "",
				fieldId: fieldIds.description,
				label: labels.description,
			};

			// See the title props comment for why this is.
			if ( descriptionProps.content.match( /%%\w+%%$/ ) ) {
				descriptionProps.content += " ";
			}
		}

		return {
			showTitle,
			showDescription,
			titleProps,
			descriptionProps,
		};
	} ),

	withDispatch( ( dispatch, { dataPath } ) => {
		const {
			setData,
		} = dispatch( REDUX_STORE_KEY );

		return {
			onTitleChange: ( value ) => setData( dataPath + ".title", value ),
			onDescriptionChange: ( value ) => setData( dataPath + ".description", value ),
		};
	} ),
] )( ReplacementVariableFields );
