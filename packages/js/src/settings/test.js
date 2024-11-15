import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	$getAllNodes,
	$getRoot,
	AutoFocusPlugin,
	ContentEditable,
	EmojiList,
	EmojiPickerPlugin,
	HistoryPlugin,
	LexicalComposer,
	LexicalErrorBoundary,
	OnChangePlugin,
	ReplacementNode,
	ReplacementPlugin,
	RichTextPlugin,
	SingleLinePlugin,
} from "@yoast/lexical-editor";
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
			<LexicalComposer initialConfig={ editorConfig }>
				<RichTextPlugin
					contentEditable={ <ContentEditable className="yst-lexical-editor yst-tag-input yst-block" /> }
					ErrorBoundary={ LexicalErrorBoundary }
					placeholder={ <div
						className="yst-absolute yst-top-0 yst-py-2 yst-px-3 yst-pointer-events-none"
					>{ __( "Enter some text...", "wordpress-seo" ) }</div> }
				/>
				<HistoryPlugin />
				<OnChangePlugin ignoreSelectionChange={ true } onChange={ handleChange } />
				<SingleLinePlugin />
				<AutoFocusPlugin />
				<ReplacementPlugin
					items={ items }
					trigger="%%"
					minLength={ 0 }
					transformItemToEditor={ transformItemToEditor }
				/>
				<EmojiPickerPlugin emojiList={ EmojiList } />
			</LexicalComposer>
		</div>
	);
};
