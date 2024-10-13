import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { BeautifulMentionNode, BeautifulMentionsPlugin } from "lexical-beautiful-mentions";
import PropTypes from "prop-types";
import React from "react";
import { NoFormattingPlugin, NoIndentingPlugin, OnTextContentChangePlugin, SingleLinePlugin } from "./plugins";

/**
 * @param {Object} [initialConfig] The initial configuration for the editor.
 * @param {JSX.node} [children] Additional plugins to include in the editor.
 * @param {function} [onChange] Callback function for editor content changes.
 * @param {function} [onTextContentChange] Callback function for editor text content changes.
 * @param {boolean} [hasFormatting] Whether the editor should have formatting. Defaults to false.
 * @param {boolean} [hasIndenting] Whether the editor should have indenting. Defaults to false.
 * @param {boolean} [isSingleLine] Whether the editor should be single line. Defaults to false.
 * @param {boolean} [shouldAutoFocus] Whether to focus the editor on mount. Defaults to false.
 * @param {boolean} [ignoreSelectionChange] Whether to ignore selection changes. Defaults to true.
 * @param {Object} [mentionsProps] The mentions props for the BeautifulMentionsPlugin.
 * @param {string} [className] Additional class name for the editor. Defaults to "yst-lexical-editor".
 * @param {Object} [props] Additional props for the RichTextPlugin.
 * @returns {JSX.Element} The lexical editor.
 */
export const LexicalEditor = ( {
	initialConfig,
	children,
	onChange,
	ignoreSelectionChange,
	onTextContentChange,
	isSingleLine,
	hasFormatting,
	hasIndenting,
	shouldAutoFocus,
	mentionsProps,
	className,
	...props
} ) => {
	return (
		<LexicalComposer initialConfig={ initialConfig }>
			<RichTextPlugin
				contentEditable={ <ContentEditable className={ className } /> }
				ErrorBoundary={ LexicalErrorBoundary }
				{ ...props }
			/>
			<HistoryPlugin />
			<OnChangePlugin ignoreSelectionChange={ ignoreSelectionChange } onChange={ onChange } />
			<OnTextContentChangePlugin ignoreSelectionChange={ ignoreSelectionChange } onChange={ onTextContentChange } />
			{ hasFormatting && <NoFormattingPlugin /> }
			{ hasIndenting && <NoIndentingPlugin /> }
			{ isSingleLine && <SingleLinePlugin /> }
			{ shouldAutoFocus && <AutoFocusPlugin /> }
			{ initialConfig.nodes?.includes( BeautifulMentionNode ) && <BeautifulMentionsPlugin { ...mentionsProps } /> }
			{ children }
		</LexicalComposer>
	);
};

LexicalEditor.propTypes = {
	initialConfig: PropTypes.object,
	children: PropTypes.node,
	onChange: PropTypes.func,
	ignoreSelectionChange: PropTypes.bool,
	onTextContentChange: PropTypes.func,
	hasFormatting: PropTypes.bool,
	hasIndenting: PropTypes.bool,
	isSingleLine: PropTypes.bool,
	shouldAutoFocus: PropTypes.bool,
	mentionsProps: PropTypes.object,
	className: PropTypes.string,
};
LexicalEditor.defaultProps = {
	initialConfig: {
		namespace: "yoast-seo/lexical-editor",
		nodes: [ BeautifulMentionNode ],
	},
	children: null,
	onChange: null,
	ignoreSelectionChange: true,
	onTextContentChange: null,
	hasFormatting: false,
	hasIndenting: false,
	isSingleLine: false,
	shouldAutoFocus: false,
	mentionsProps: null,
	className: "yst-lexical-editor",
};
