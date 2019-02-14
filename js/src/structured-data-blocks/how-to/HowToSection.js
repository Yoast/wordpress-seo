/* External dependencies */
import { InnerBlocks } from "@wordpress/editor";
import { Component } from "@wordpress/element";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default class HowToSection extends Component {
	render() {
		return <InnerBlocks
			template={ [["yoast/title",{},[]],["yoast/how-to-step",{},[]]] }
			templateLock={ true }
			allowedBlocks={ ["yoast/title","yoast/how-to-step"] }
		/>;
	}

	static Content() {
		return <InnerBlocks.Content />;
	}
}

