import { Table } from "@yoast/ui-library";
import { ReplacementVariableEditorStandalone } from "@yoast/replacement-variable-editor";
import { noop } from "lodash";
import { sprintf, __ } from "@wordpress/i18n";
import { FOCUS_KEYPHRASE_KEY } from "../../constants";

/**
 *
 * @param {object} props The component props.
 * @param {object} props.field The field to render.
 * @param {object} props.item The content item to render.
 * @param {Array}  props.replacementVariables The replacement variables for this content type.
 * @param {Array}  props.recommendedReplacementVariables The recommended replacement variables for this content type.
 * @returns {JSX.Element} The cell.
 */
export const PreviewEditableFieldCell = ( { field, item, replacementVariables, recommendedReplacementVariables } ) => {
	if ( field.key === FOCUS_KEYPHRASE_KEY ) {
		return (
			<Table.Cell key={ field.key } className="yst-bulk-editor-cell-value">
				{ item[ field.key ] }
			</Table.Cell>
		);
	}

	return (
		<Table.Cell key={ field.key } className="yst-bulk-editor-cell-value">
			<span id={ `bulk-editor-preview-${ field.key }-${ item.id }` } className="yst-sr-only">
				{ sprintf(
					/* translators: %1$s expands to the field label, %2$s to the content item title. */
					__( "%1$s for %2$s", "wordpress-seo" ), field.label, item.title ) }
			</span>
			<ReplacementVariableEditorStandalone
				content={ item[ field.key ] || item[ `${ field.key }Fallback` ] || "" }
				onChange={ noop }
				type={ field.type }
				isDisabled={ true }
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				ariaLabelledBy={ `bulk-editor-preview-${ field.key }-${ item.id }` }
				fieldId={ `bulk-editor-${ field.key }-${ item.id }` }
			/>
		</Table.Cell>
	);
};
