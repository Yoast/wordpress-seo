import { render, Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components"

const props = {
	siteName: "My awesome site",
	title: "My awesome title",
	src: "https://yoast.com/app/uploads/2019/03/Quick_wins_Hero_480.png",
};

const Social = () => {
	return (
		<Fragment>
			<Collapsible hasSeparator={ true } title="Facebook">
				<Slot name="wpseo-facebook-preview" />
			</Collapsible>
			<Collapsible hasSeparator={ true } title="Twitter">
				<Slot name="wpseo-twitter-preview" />
			</Collapsible>
		</Fragment>
	);
};

render( <Social />, document.getElementById( "wpseo-section-social" ) );
