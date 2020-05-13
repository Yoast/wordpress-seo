window.wpseoAdminL10n = {
	noIndex: true,
	privateBlog: true,
	postTypeNameSingular: "Post",
	postTypeNamePlural: "Posts",
	label: "Posts",
	postType: "post",
	breadcrumbsDisabled: false,
};

window.wpseoScriptData = {
	isPost: true,
};

import React, { Fragment } from "react";
import renderer from "react-test-renderer";
import AdvancedSettings from "../src/components/AdvancedSettings";

describe( "Advanced Settings", () => {
	it( "should render if all data is present", () => {
		const component = renderer.create(
			<Fragment>
				<input type="hidden" id="yoast_wpseo_meta-robots-noindex" value="0" />
				<input type="hidden" id="yoast_wpseo_meta-robots-nofollow" value="0" />
				<input type="hidden" id="yoast_wpseo_meta-robots-adv" value="nosnippet" />
				<input type="hidden" id="yoast_wpseo_bctitle" value="Beautiful Title" />
				<input type="hidden" id="yoast_wpseo_canonical" value="https://www.google.com" />
				<AdvancedSettings />
			</Fragment>
		);
		const tree = component.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
}
);
