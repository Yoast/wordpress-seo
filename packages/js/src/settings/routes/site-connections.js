import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { TextField } from "@yoast/ui-library";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FormikValueChangeField, FormLayout, RouteLayout } from "../components";
import { withFormikError } from "../hocs";
import { useSelectSettings } from "../hooks";

const CONTENT_TAG_REGEXP = /content=(['"])?(?<content>[^'"> ]+)(?:\1|[ />])/;

/**
 * Transforms the value to the content of the content tag.
 *
 * If the value is a HTML tag, e.g. `<meta content="foo" />`.
 * Then this function will return `foo`.
 * Otherwise, the original value will be returned.
 *
 * @param {Object} event The change event.
 * @returns {string} The original value or the value of the content tag.
 */
const transformContentTag = event => {
	const match = event.target.value.match( CONTENT_TAG_REGEXP );
	return match?.groups?.content ? match.groups.content : event.target.value;
};

const FormikValueChangeWithErrorField = withFormikError( FormikValueChangeField );

/**
 * @returns {JSX.Element} The site connections route.
 */
const SiteConnections = () => {
	const siteUrl = useSelectSettings( "selectPreference", [], "siteUrl" );

	return (
		<RouteLayout
			title={ __( "Site connections", "wordpress-seo" ) }
			description={ __( "Verify your site with different tools. This will add a verification meta tag to your homepage. You can find instructions on how to verify your site for each platform by following the link in the description.", "wordpress-seo" ) }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-max-w-screen-sm yst-space-y-8">
						<FormikValueChangeWithErrorField
							as={ TextField }
							type="text"
							name="wpseo.baiduverify"
							id="input-wpseo-baiduverify"
							label={ __( "Baidu", "wordpress-seo" ) }
							description={ addLinkToString(
								sprintf(
									// translators: %1$s and %2$s are replaced by opening and closing <a> tags, respectively.
									__( "Get your verification code in %1$sBaidu Webmaster tools%2$s.", "wordpress-seo" ),
									"<a>",
									"</a>"
								),
								"https://ziyuan.baidu.com/site",
								"link-baidu-webmaster-tools"
							) }
							placeholder={ __( "Add verification code", "wordpress-seo" ) }
							transformValue={ transformContentTag }
						/>
						<FormikValueChangeWithErrorField
							as={ TextField }
							type="text"
							name="wpseo.msverify"
							id="input-wpseo-msverify"
							label={ __( "Bing", "wordpress-seo" ) }
							description={ addLinkToString(
								sprintf(
									// translators: %1$s and %2$s are replaced by opening and closing <a> tags, respectively.
									__( "Get your verification code in %1$sBing Webmaster tools%2$s.", "wordpress-seo" ),
									"<a>",
									"</a>"
								),
								`https://www.bing.com/toolbox/webmaster/#/Dashboard/?url=${ siteUrl }`,
								"link-bing-webmaster-tools"
							) }
							placeholder={ __( "Add verification code", "wordpress-seo" ) }
							transformValue={ transformContentTag }
						/>
						<FormikValueChangeWithErrorField
							as={ TextField }
							type="text"
							name="wpseo.googleverify"
							id="input-wpseo-googleverify"
							label={ __( "Google", "wordpress-seo" ) }
							description={ addLinkToString(
								sprintf(
									// translators: %1$s and %2$s are replaced by opening and closing <a> tags, respectively.
									__( "Get your verification code in %1$sGoogle Search console%2$s.", "wordpress-seo" ),
									"<a>",
									"</a>"
								),
								addQueryArgs( "https://search.google.com/search-console/users", { hl: "en", tid: "alternate", siteUrl } ),
								"link-google-search-console"
							) }
							placeholder={ __( "Add verification code", "wordpress-seo" ) }
							transformValue={ transformContentTag }
						/>
						<FormikValueChangeWithErrorField
							as={ TextField }
							type="text"
							name="wpseo_social.pinterestverify"
							id="input-wpseo_social-pinterestverify"
							label={ __( "Pinterest", "wordpress-seo" ) }
							description={ addLinkToString(
								sprintf(
									// translators: %1$s and %2$s are replaced by opening and closing <a> tags, respectively.
									__( "Claim your site over at %1$sPinterest%2$s.", "wordpress-seo" ),
									"<a>",
									"</a>"
								),
								"https://www.pinterest.com/settings/claim",
								"link-pinterest"
							) }
							placeholder={ __( "Add verification code", "wordpress-seo" ) }
							transformValue={ transformContentTag }
						/>
						<FormikValueChangeWithErrorField
							as={ TextField }
							type="text"
							name="wpseo.yandexverify"
							id="input-wpseo-yandexverify"
							label={ __( "Yandex", "wordpress-seo" ) }
							description={ addLinkToString(
								sprintf(
									// translators: %1$s and %2$s are replaced by opening and closing <a> tags, respectively.
									__( "Get your verification code in %1$sYandex Webmaster tools%2$s.", "wordpress-seo" ),
									"<a>",
									"</a>"
								),
								"https://webmaster.yandex.com/sites/add/",
								"link-yandex-webmaster-tools"
							) }
							placeholder={ __( "Add verification code", "wordpress-seo" ) }
							transformValue={ transformContentTag }
						/>
					</fieldset>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteConnections;
