import React from "react";
import SnippetEditor from "../composites/Plugin/SnippetEditor/components/SnippetEditor";

const replaceVars = [
	{
		name: "title",
		description: "The title of your post.",
	},
	{
		name: "post_type",
		description: "The post type of your post.",
	},
	{
		name: "snippet",
		description: "The snippet of your post.",
	},
	{
		name: "snippet_manual",
		description: "The manual snippet of your post.",
	},
];

const SnippetEditorWrapper = () => <SnippetEditor replacementVariables={ replaceVars } />;

export default SnippetEditorWrapper;
