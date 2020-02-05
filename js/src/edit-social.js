import { Fragment, createPortal } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";

const props = {
	siteName: "My awesome site",
	title: "My awesome title",
	src: "https://yoast.com/app/uploads/2019/03/Quick_wins_Hero_480.png",
};

const Social = () => {
	return createPortal(
		<Fragment>
			<Collapsible hasSeparator={ true } title="Facebook">
				<Slot name="YoastFacebookPreview" />
			</Collapsible>
			<Collapsible hasSeparator={ true } title="Twitter">
				<Slot name="YoastTwitterPreview" />
			</Collapsible>
		</Fragment>,
		document.getElementById( "wpseo-section-social" ) );
};

registerPlugin( "yoast-seo-social-previews", {
	render: () => {
		return <Social />;
	},
} );
