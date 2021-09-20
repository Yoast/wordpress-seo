import { useSelect, withSelect } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Section } from "@yoast/admin-ui-toolkit/components";
import PropTypes from "prop-types";
import { REDUX_STORE_KEY } from "../../constants";
import TextInput from "../text-input";
import Page from "../page";

/**
 * Renders a paragraph with a link in the text.
 *
 * @param {Object} props      The props.
 * @param {string} props.text The text with tags to replace.
 * @param {string} props.optionPath The URL to link to.
 *
 * @returns {JSX.Element} A paragraph with a link in the running text.
 */
function DescriptionWithLink( { text, optionPath } ) {
	const link = useSelect( ( select ) => select( REDUX_STORE_KEY ).getOption( optionPath ) );

	return (
		<p className="yst-mt-2">
			{ createInterpolateElement(
				text,
				{
					/* eslint-disable-next-line jsx-a11y/anchor-has-content */
					a: <a href={ link } target="_blank" rel="noopener noreferrer" />,
				},
			) }
		</p>
	);
}

DescriptionWithLink.propTypes = {
	text: PropTypes.string.isRequired,
	optionPath: PropTypes.string.isRequired,
};


/**
 * The WebmasterTools page.
 *
 * @param {Object} props.options The options.
 *
 * @returns {WPElement} The WebmasterTools page.
 */
function WebmasterTools( { options } ) {
	return (
		<Page
			title={ __( "Webmaster tools", "admin-ui" ) }
			description={ __( "Verify your site with different webmaster tools. This will add a verification meta tag on your homepage. You can find instructions on how to verify your site for each platform by following the link in the description.", "admin-ui" ) }
		>
			<Section>
				{ options.baidu && <div className="yst-mb-8 last:yst-mb-0">
					<TextInput
						dataPath={ "integrations.webmasterVerification.baidu" }
						id="yst-webmaster-tools-baidu"
						label={ __( "Baidu verification code", "admin-ui" ) }
						placeholder={ __( "Add verification code", "admin-ui" ) }
					/>
					<DescriptionWithLink
						// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
						text={ sprintf( __( "Get your Baidu verification code in %1$sBaidu Webmaster tools%2$s.", "admin-ui" ), "<a>", "</a>" ) }
						optionPath={ "integrations.webmasterVerification.baiduLink" }
					/>
				</div> }

				{ options.bing && <div className="yst-mb-8 last:yst-mb-0">
					<TextInput
						dataPath={ "integrations.webmasterVerification.bing" }
						id="yst-webmaster-tools-bing"
						label={ __( "Bing verification code", "admin-ui" ) }
						placeholder={ __( "Add verification code", "admin-ui" ) }
					/>
					<DescriptionWithLink
						// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
						text={ sprintf( __( "Get your Bing verification code in %1$sBing Webmaster tools%2$s.", "admin-ui" ), "<a>", "</a>" ) }
						optionPath={ "integrations.webmasterVerification.bingLink" }
					/>
				</div> }

				{ options.google && <div className="yst-mb-8 last:yst-mb-0">
					<TextInput
						dataPath={ "integrations.webmasterVerification.google" }
						id="yst-webmaster-tools-google"
						label={ __( "Google verification code", "admin-ui" ) }
						placeholder={ __( "Add verification code", "admin-ui" ) }
					/>
					<DescriptionWithLink
						// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
						text={ sprintf( __( "Get your Google verification code in %1$sGoogle Webmaster tools%2$s.", "admin-ui" ), "<a>", "</a>" ) }
						optionPath={ "integrations.webmasterVerification.googleLink" }
					/>
				</div> }

				{ options.pinterest && <div className="yst-mb-8 last:yst-mb-0">
					<TextInput
						dataPath={ "integrations.webmasterVerification.pinterest" }
						id="yst-webmaster-tools-pinterest"
						label={ __( "Pinterest meta tag", "admin-ui" ) }
						// translators: %s is replaced with "<meta>".
						placeholder={ sprintf( __( "Add the %s tag here", "admin-ui" ), "<meta>" ) }
					/>
					<DescriptionWithLink
						// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
						text={ sprintf( __( "Claim your site %1$sover at Pinterest%2$s.", "admin-ui" ), "<a>", "</a>" ) }
						optionPath={ "integrations.webmasterVerification.pinterestLink" }
					/>
				</div> }

				{ options.yandex && <div className="yst-mb-8 last:yst-mb-0">
					<TextInput
						dataPath={ "integrations.webmasterVerification.yandex" }
						id="yst-webmaster-tools-yandex"
						label={ __( "Yandex verification code", "admin-ui" ) }
						placeholder={ __( "Add verification code", "admin-ui" ) }
					/>
					<DescriptionWithLink
						// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
						text={ sprintf( __( "Get your Yandex verification code in %1$sYandex Webmaster tools%2$s.", "admin-ui" ), "<a>", "</a>" ) }
						optionPath={ "integrations.webmasterVerification.yandexLink" }
					/>
				</div> }
			</Section>
		</Page>
	);
}

WebmasterTools.propTypes = {
	options: PropTypes.shape( {
		baidu: PropTypes.bool,
		bing: PropTypes.bool,
		google: PropTypes.bool,
		pinterest: PropTypes.bool,
		yandex: PropTypes.bool,
	} ),
};

WebmasterTools.defaultProps = {
	options: {
		baidu: false,
		bing: false,
		google: false,
		pinterest: false,
		yandex: false,
	},
};

/**
 * Connects the webmasterVerification options selector with the WebmasterTools page.
 */
export default withSelect( ( select ) => {
	const { getOption } = select( "yoast-seo/settings" );
	return { options: getOption( "integrations.webmasterVerification" ) };
} )( WebmasterTools );

