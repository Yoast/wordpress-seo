/* External dependencies */
import { InnerBlocks } from "@wordpress/editor";
import { Component } from "@wordpress/element";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default class HowTo extends Component {
	render() {
		return <InnerBlocks
			template={ [["yoast/total-time",{},[]],["yoast/description",{},[]]] }
			templateLock={ false }
			allowedBlocks={ ["yoast/description","yoast/total-time","yoast/steps"] }
		/>;
	}

	static Content() {
		return <InnerBlocks.Content />;
	}
}

