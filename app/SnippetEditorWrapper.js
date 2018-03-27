import React from "react";
import SnippetEditorFields from "../composites/Plugin/SnippetEditor/components/SnippetEditorFields";

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

const SnippetEditorWrapper = () => <SnippetEditorFields replacementVariables={ replaceVars } />;

export default SnippetEditorWrapper;
