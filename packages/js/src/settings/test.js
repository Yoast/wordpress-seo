import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { $getAllNodes, $getRoot, LexicalEditor, ReplacementNode, ReplacementPlugin } from "@yoast/lexical-editor";
import { Badge } from "@yoast/ui-library";
import { useSelectSettings } from "./hooks";

const editorConfig = {
	namespace: "yoast-seo/lexical-editor",
	nodes: [ ReplacementNode ],
	onError: console.error,
};

/**
 * @param {Object} item The item.
 * @returns {JSX.Element} The element.
 */
const transformItemToEditor = ( item ) => (
	<Badge className="yst-badge yst-badge--plain yst-tag-input__tag yst-pe-2">
		{ item.getLabel() }
	</Badge>
);

export const Test = () => {
	const handleChange = useCallback( ( editorState ) => {
		editorState.read( () => {
			const nodes = $getAllNodes();
			const root = $getRoot();
			console.log( nodes, root.getTextContent() );
		} );
	}, [] );

	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const items = useMemo( () => replacementVariables.map( ( { name, label, ...data } ) => ( { name, label, data } ) ), [] );

	return (
		<div className="yst-relative">
			<LexicalEditor
				initialConfig={ editorConfig }
				placeholder={ <div
					className="yst-absolute yst-top-0 yst-py-2 yst-px-3 yst-pointer-events-none"
				>{ __( "Enter some text...", "wordpress-seo" ) }</div> }
				onChange={ handleChange }
				isSingleLine={ true }
				shouldAutoFocus={ true }
				className="yst-lexical-editor yst-tag-input yst-block"
			>
				<ReplacementPlugin
					items={ items }
					trigger="%%"
					minLength={ 0 }
					transformItemToEditor={ transformItemToEditor }
				/>
			</LexicalEditor>
		</div>
	);
};
