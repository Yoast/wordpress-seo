/* External dependencies */
import { InnerBlocks } from "@wordpress/editor";
import { Component } from "@wordpress/element";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default class FAQPage extends Component {
	render() {
		return <InnerBlocks
			template={ [["yoast/questions",{},[]]] }
			templateLock={ true }
			allowedBlocks={ ["yoast/questions"] }
		/>;
	}

	static Content() {
		return <InnerBlocks.Content />;
	}
}

