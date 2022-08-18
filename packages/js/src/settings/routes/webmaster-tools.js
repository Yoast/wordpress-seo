import { __, sprintf } from "@wordpress/i18n";
import { TextField } from "@yoast/ui-library";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FormikWithErrorField, FormLayout } from "../components";
import { createLink } from "../helpers";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The webmaster tools route.
 */
const WebmasterTools = () => {
	const siteUrl = useSelectSettings( "selectPreference", [], "siteUrl" );

	return (
		<FormLayout
			title={ __( "Webmaster tools", "wordpress-seo" ) }
			description={ __( "Verify your site with different webmaster tools. This will add a verification meta tag on your homepage. You can find instructions on how to verify your site for each platform by following the link in the description.", "wordpress-seo" ) }
		>
			<fieldset className="yst-max-w-screen-sm yst-space-y-8">
				<FormikWithErrorField
					as={ TextField }
					type="text"
					name="wpseo.baiduverify"
					id="input-wpseo-baiduverify"
					label={ __( "Baidu", "wordpress-seo" ) }
					description={ addLinkToString(
						sprintf(
							__( "Get your verification code in %1$sBaidu Webmaster tools%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						"https://ziyuan.baidu.com/site/siteadd",
						"link-baidu-webmaster-tools"
					) }
					placeholder={ __( "Add verification code", "wordpress-seo" ) }
				/>
				<FormikWithErrorField
					as={ TextField }
					type="text"
					name="wpseo.msverify"
					id="input-wpseo-msverify"
					label={ __( "Bing", "wordpress-seo" ) }
					description={ addLinkToString(
						sprintf(
							__( "Get your verification code in %1$sBing Webmaster tools%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						`https://www.bing.com/toolbox/webmaster/#/Dashboard/?url=${ siteUrl }`,
						"link-bing-webmaster-tools"
					) }
					placeholder={ __( "Add verification code", "wordpress-seo" ) }
				/>
				<FormikWithErrorField
					as={ TextField }
					type="text"
					name="wpseo.googleverify"
					id="input-wpseo-googleverify"
					label={ __( "Google", "wordpress-seo" ) }
					description={ addLinkToString(
						sprintf(
							__( "Get your verification code in %1$sGoogle Search console%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						createLink( "https://www.google.com/webmasters/verification/verification", { hl: "en", tid: "alternate", siteUrl } ),
						"link-google-search-console"
					) }
					placeholder={ __( "Add verification code", "wordpress-seo" ) }
				/>
				<FormikWithErrorField
					as={ TextField }
					type="text"
					name="wpseo_social.pinterestverify"
					id="input-wpseo_social-pinterestverify"
					label={ __( "Pinterest", "wordpress-seo" ) }
					description={ addLinkToString(
						sprintf(
							__( "Claim your site %1$sover at Pinterest%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						"https://www.pinterest.com/settings/claim",
						"link-pinterest"
					) }
					placeholder={ __( "Add verification code", "wordpress-seo" ) }
				/>
				<FormikWithErrorField
					as={ TextField }
					type="text"
					name="wpseo.yandexverify"
					id="input-wpseo-yandexverify"
					label={ __( "Yandex", "wordpress-seo" ) }
					description={ addLinkToString(
						sprintf(
							__( "Get your verification code in %1$sYandex Webmaster tools%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						"https://webmaster.yandex.com/sites/add/",
						"link-yandex-webmaster-tools"
					) }
					placeholder={ __( "Add verification code", "wordpress-seo" ) }
				/>
			</fieldset>
		</FormLayout>
	);
};

export default WebmasterTools;
