import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { __, sprintf } from "@wordpress/i18n";
import { Button, ToggleField } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
	NewsSeoAlert,
	RouteLayout,
} from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The media pages route.
 */
const LlmTxt = () => {
	const label = "llms.txt";
    const hasGenerationFailed = useSelectSettings( "selectLlmsTxtConfig", [], "generationFailure" );
	const generationFailureReason = useSelectSettings( "selectLlmsTxtConfig", [], "generationFailureReason" );
	const llmsTxtUrl = useSelectSettings( "selectLlmsTxtConfig", [], "llmsTxtUrl" );
	const seeMoreLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-features-llmstxt-learn-more" );

	console.log( "hasGenerationFailed", hasGenerationFailed );
	console.log( "generationFailureReason", generationFailureReason );

	const { values } = useFormikContext();
	const {
		"enable_llms_txt": isLlmsTxtEnabled,
	} = values.wpseo;

	const description = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "Boost the visibility of your content in AI searches. This helps LLMs access and provide your site's information more easily. %1$sLearn more about the llms.txt file%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-settings-info" href={ seeMoreLink } target="_blank" rel="noopener noreferrer" />,
		}
	) );

	return (
		<RouteLayout
			title={ label }
			description={ description }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-space-y-8">
						<FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name="wpseo.enable_llms_txt"
							id="input-wpseo.enable_llms_txt"
							label={ sprintf(
								// translators: %1$s expands to "llms.txt".
								__( "Enable %1$s file", "wordpress-seo" ),
								label
							) }
							description={ sprintf(
								// translators: %1$s expands to "llms.txt".
								__( "By enabling this feature an %1$s file is automatically generated that lists a selection of your site's content.", "wordpress-seo" ),
								label
							) }
							className="yst-max-w-sm"
						/>
					</fieldset>
					<hr className="yst-my-8" />
					<FieldsetLayout title={ sprintf(
							// translators: %1$s expands to "llms.txt".
							__( "View the %1$s file", "wordpress-seo" ),
							label
						) }
					>
						<Button
							as="a"
							id="link-llms"
							href={ llmsTxtUrl }
							variant="secondary"
							target="_blank"
							rel="noopener"
							className="yst-self-start"
						>
							{ sprintf(
								// translators: %1$s expands to "llms.txt".
								__( "View the %1$s file", "wordpress-seo" ),
								label
							) }
							<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-slate-400 rtl:yst-rotate-[270deg]" />
						</Button>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default LlmTxt;
