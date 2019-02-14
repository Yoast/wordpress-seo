/* External dependencies */
import { InnerBlocks } from "@wordpress/editor";
import { Component } from "@wordpress/element";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default class Question extends Component {
	render() {
		return <InnerBlocks
			template={ [["yoast/title",{},[]],["yoast/answer",{},[]]] }
			templateLock={ true }
			allowedBlocks={ ["yoast/title","yoast/answer"] }
		/>;
	}

	static Content() {
		return <InnerBlocks.Content />;
	}
}

