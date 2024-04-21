import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { BeautifulMentionNode, EmojiList, LexicalEditor } from "@yoast/lexical-editor";
import { useSelectSettings } from "./hooks";

const beautifulMentionsTheme = {
	"@": "yst-px-1 yst-mx-px",
	"@Focused": "yst-outline-none yst-shadow-md",
	"due:": {
		trigger: "yst-hidden",
		value: "yst-text-orange-400",
		container: "yst-px-1 yst-mx-px",
		containerFocused: "yst-outline-none yst-shadow-md",
	},
	":": {
		trigger: "yst-hidden",
		value: "",
		container: "",
		containerFocused: "",
	},
	"%": {
		trigger: "yst-hidden",
		container: "yst-badge yst-badge--plain yst-tag-input__tag yst-pe-2",
		containerFocused: "yst-badge yst-badge--plain yst-tag-input__tag yst-pe-2 yst-outline-none yst-ring-2 yst-ring-primary-500",
	},
};

const editorConfig = {
	namespace: "yoast-seo/lexical-editor",
	nodes: [ BeautifulMentionNode ],
	onError: console.error,
	theme: {
		beautifulMentions: beautifulMentionsTheme,
	},
};

export const Test = () => {
	const handleChange = useCallback( ( editorState ) => {
		console.log( editorState );
	}, [] );

	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const mentionsProps = useMemo( () => ( {
		items: {
			"@": [ "Anton", "Boris", "Catherine", "Dmitri", "Elena", "Felix", "Gina" ],
			"#": [ "Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape" ],
			"due:": [ "Today", "Tomorrow", "01-01-2023" ],
			":": Object.values( EmojiList ).map( ( { emoji, ...rest } ) => ( { value: emoji, ...rest } ) ),
			"%": replacementVariables.map( ( { label, value, ...rest } ) => ( { value: label, val: value, ...rest } ) ),
		},
	} ), [ replacementVariables ] );

	return (
		<div className="yst-relative">
			<LexicalEditor
				initialConfig={ editorConfig }
				placeholder={ <div
					className="yst-absolute yst-top-0 yst-py-2 yst-px-3 yst-pointer-events-none"
				>{ __( "Enter some text...", "wordpress-seo" ) }</div> }
				onChange={ handleChange }
				isSingleLine={ true }
				mentionsProps={ mentionsProps }
				className="yst-lexical-editor yst-tag-input yst-block"
			/>
		</div>
	);
};
