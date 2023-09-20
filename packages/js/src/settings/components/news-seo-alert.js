import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { get } from "lodash";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
import { useSelectSettings } from "../hooks";

/**
 * @param {string} name The post type name.
 * @param {boolean} disabled Whether the alert is disabled.
 *
 * @returns {JSX.Element|null} The news alert or null.
 */
const NewsSeoAlert = ( { name, disabled = false } ) => {
	const isNewsSeoActive = useSelectSettings( "selectPreference", [], "isNewsSeoActive" );
	const getNewsSeoLink = useSelectSettings( "selectLink", [], "https://yoa.st/get-news-settings" );
	const { values } = useFormikContext();
	const isNewsArticle = useMemo(
		() => get( values, `wpseo_titles.schema-article-type-${ name }`, "" ) === "NewsArticle",
		[ name, values ]
	);

	if ( isNewsSeoActive ) {
		return null;
	}

	return (
		<AnimateHeight
			easing="ease-in-out"
			duration={ 300 }
			height={ isNewsArticle && ! disabled ? "auto" : 0 }
			animateOpacity={ true }
		>
			<Alert className="yst-mt-8" variant="info" role="status">
				{
					sprintf(
						/* translators: %s Expands to "Yoast News SEO" */
						__(
							"Are you publishing news articles? %s helps you optimize your site for Google News.",
							"wordpress-seo"
						),
						"Yoast News SEO"
					)
				}
				{ " " }
				<a id="link-get-news-seo" href={ getNewsSeoLink } target="_blank" rel="noopener noreferrer">
					{ sprintf(
						/* translators: %s: Expands to "Yoast News SEO". */
						__( "Get the %s plugin now!", "wordpress-seo" ),
						"Yoast News SEO"
					) }
				</a>
			</Alert>
		</AnimateHeight>
	);
};

NewsSeoAlert.propTypes = {
	name: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
};

export default NewsSeoAlert;
