import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { ToggleField } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useFormikContext } from "formik";
import { useSelectSettings } from "../hooks";
import { FormikValueChangeField } from "../../shared-admin/components/form";
import {
	FormLayout,
	RouteLayout,
} from "../components";

/**
 * @returns {JSX.Element} The schema framework feature route.
 */
const SchemaFramework = () => {
	const seeMoreLink = useSelectSettings( "selectLink", [], "https://yoa.st/structured-data-learn-more" );

	const { values } = useFormikContext();

	const { enable_schema: enabledSchemaFramework } = values.wpseo;

	const featureDescription = sprintf(
		/* translators: %1$s is replaced by "Yoast SEO". */
		__( "The %1$s Schema Framework automatically builds a single, connected Schema graph for your site.", "wordpress-seo" ),
		"Yoast SEO"
	);

	const toggleDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "Add %1$sstructured data%2$s to your pages, helping search engines and LLMs understand your content and display it in rich results.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="structured-data-link" href={ seeMoreLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [ seeMoreLink ] );

	return (
		<RouteLayout
			title={ __( "Schema Framework", "wordpress-seo" ) }
			description={ featureDescription }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-space-y-8">

						<div className="yst-relative yst-max-w-sm">
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_schema"
								id="input-wpseo.enable_schema"
								label={ __( "Enable Schema Framework", "wordpress-seo" ) }
								description={ toggleDescription }
							/>
						</div>
					</fieldset>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SchemaFramework;
