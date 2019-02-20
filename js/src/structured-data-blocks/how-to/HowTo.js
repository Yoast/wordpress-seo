/* External dependencies */
import { InnerBlocks } from "@wordpress/editor";
import { Component } from "@wordpress/element";
import isUndefined from "lodash/isUndefined";
import uniqueId from "lodash/uniqueId";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default class HowTo extends Component {
	componentDidMount() {
		const { setAttributes, attributes } = this.props;

		if ( isUndefined( attributes.id ) ) {
			setAttributes( { id: uniqueId( "how-to-" ) } );
		}
	}

	render() {
		return <InnerBlocks
			template={ [["yoast/duration",{},[]],["yoast/description",{},[]],["yoast/steps",{},[]]] }
			templateLock={ false }
			allowedBlocks={ ["yoast/description","yoast/duration","yoast/steps"] }
		/>;
	}

	static Content() {
		return <InnerBlocks.Content />;
	}
}

