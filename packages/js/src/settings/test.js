import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { BeautifulMentionNode, EmojiList, LexicalEditor } from "@yoast/lexical-editor";

const beautifulMentionsTheme = {
	// 👇 use the trigger name as the key
	"@": "yst-px-1 yst-mx-px",
	// 👇 add the "Focused" suffix to style the focused mention
	"@Focused": "yst-outline-none yst-shadow-md",
	// 👇 use a class configuration object for advanced styling
	"due:": {
		trigger: "yst-hidden",
		value: "yst-text-orange-400",
		container: "yst-px-1 yst-mx-px",
		containerFocused: "yst-outline-none yst-shadow-md",
	},
	":": {
		trigger: "yst-hidden",
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

const mentionItems = {
	"@": [ "Anton", "Boris", "Catherine", "Dmitri", "Elena", "Felix", "Gina" ],
	"#": [ "Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape" ],
	"due:": [ "Today", "Tomorrow", "01-01-2023" ],
	":": Object.values( EmojiList ).map( ( { emoji, ...rest } ) => ( { value: emoji, ...rest } ) ),
};

export const Test = () => {
	const handleChange = useCallback( ( textContent ) => {
		console.log( textContent );
	}, [] );

	return (
		<div className="yst-relative">
			<LexicalEditor
				initialConfig={ editorConfig }
				placeholder={ <div className="yst-absolute yst-top-0 yst-pointer-events-none">{ __( "Enter some text...", "wordpress-seo" ) }</div> }
				onChange={ handleChange }
				onTextContentChange={ handleChange }
				isSingleLine={ true }
				mentionItems={ mentionItems }
			/>
		</div>
	);
};
