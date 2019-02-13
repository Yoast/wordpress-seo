/* External dependencies */
import { InnerBlocks } from "@wordpress/editor";
import { Component } from "@wordpress/element";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default class HowToStep extends Component {
	render() {
		return <InnerBlocks
			template={ [["yoast/description",{},[]],["yoast/title",{},[]]] }
			templateLock={ false }
			allowedBlocks={ ["yoast/title","yoast/description"] }
		/>;
	}

	static Content() {
		return <InnerBlocks.Content />;
	}
}

