import { Fragment, createPortal } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";

const Social = () => {
	return createPortal(
		<Fragment>
			<Collapsible hasSeparator={ true } title="Facebook">
				<Slot name="YoastFacebookPreview" />
				<b>Facebook form</b>
			</Collapsible>
			<Collapsible hasSeparator={ true } title="Twitter">
				<Slot name="YoastTwitterPreview" />
				<b>Twitter form</b>
			</Collapsible>
		</Fragment>,
		document.getElementById( "wpseo-section-social" ) );
};

registerPlugin( "yoast-seo-social-previews", {
	render: Social,
} );
