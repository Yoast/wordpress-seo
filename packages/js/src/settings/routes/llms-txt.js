import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, Radio, RadioGroup, ToggleField } from "@yoast/ui-library";
import { Field, useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikValueChangeField,
	FormLayout,
	RouteLayout,
} from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The llms.txt feature route.
 */
const LlmTxt = () => {
	const label = "llms.txt";
	const hasGenerationFailed = useSelectSettings( "selectLlmsTxtGenerationFailure", [] );
	const generationFailureReason = useSelectSettings( "selectLlmsTxtGenerationFailureReason", [] );
	const llmsTxtUrl = useSelectSettings( "selectLlmsTxtUrl", [] );
	const seeMoreLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-features-llmstxt-learn-more" );
	const bestPracticesLink = useSelectSettings( "selectLink", [], "https://yoa.st/llmstxt-best-practices" );

	const { values, initialValues } = useFormikContext();
	const {
		enable_llms_txt: isLlmsTxtEnabled,
		llms_txt_selection_mode: llmsTxtSelectionMode,
	} = values.wpseo;

	const {
		enable_llms_txt: initialIsLlmsTxtEnabled,
		llms_txt_selection_mode: initialLlmsTxtSelectionMode,
	} = initialValues.wpseo;

	// eslint-disable-next-line no-console
	console.log( "hasGenerationFailed", hasGenerationFailed );
	// eslint-disable-next-line no-console
	console.log( "generationFailureReason", generationFailureReason );
	// eslint-disable-next-line no-console
	console.log( "llmsTxtSelectionMode", llmsTxtSelectionMode );
	// eslint-disable-next-line no-console
	console.log( "initialLlmsTxtSelectionMode", initialLlmsTxtSelectionMode );

	const activeTxtButton = ( initialIsLlmsTxtEnabled && isLlmsTxtEnabled );

	const featureDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "Future-proof your website for visibility in AI tools like ChatGPT and Google Gemini. This helps them provide better, more accurate information about your site. %1$sLearn more about the llms.txt file%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-settings-info" href={ seeMoreLink } target="_blank" rel="noopener noreferrer" />,
		}
	) );

	const selectionDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "Generate an automatic selection based on %1$sYoast SEO’s best practices%2$s, or manually choose the content to include in your llms.txt file.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-best-practices" href={ bestPracticesLink } target="_blank" rel="noopener noreferrer" />,
		}
	) );

	return (
		<RouteLayout
			title={ label }
			description={ featureDescription }
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
								__( "Enable %1$s file feature", "wordpress-seo" ),
								label
							) }
							description={ sprintf(
								// translators: %1$s expands to "llms.txt".
								__(
									"By enabling this feature an %1$s file is automatically generated that lists a selection of your site's content.",
									"wordpress-seo"
								),
								label
							) }
							className="yst-max-w-sm"
						/>
					</fieldset>
					<Button
						as="a"
						id="link-llms"
						href={ ( activeTxtButton ) ? llmsTxtUrl : null }
						variant="secondary"
						target="_blank"
						rel="noopener"
						disabled={ ! activeTxtButton }
						aria-disabled={ ! activeTxtButton }
						className="yst-self-start yst-mt-8"
					>
						{ sprintf(
							// translators: %1$s expands to "llms.txt".
							__( "View the %1$s file", "wordpress-seo" ),
							label
						) }
						<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-slate-400 rtl:yst-rotate-[270deg]" />
					</Button>
					{ ( ! initialIsLlmsTxtEnabled && isLlmsTxtEnabled ) && <Alert id="llms-txt-save-changes-aler" variant="info" className="yst-mt-4 yst-max-w-md">
						{ sprintf(
							// translators: %1$s expands to "llms.txt".
							__( "By saving your changes we will generate your %1$s file.", "wordpress-seo" ),
							label
						) }
					</Alert> }
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ sprintf(
							// translators: %1$s expands to "llms.txt".
							__( "%1$s page selection", "wordpress-seo" ),
							label
						) }
						description={ selectionDescription }
					>
						<RadioGroup disabled={ ! isLlmsTxtEnabled }>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo.llms_txt_selection_mode"
								id="input-wpseo-llms_txt_selection_mode-auto"
								label={ __( "Automatic selection", "wordpress-seo" ) }
								value="auto"
								disabled={ ! isLlmsTxtEnabled }
							/>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo.llms_txt_selection_mode"
								id="input-wpseo-llms_txt_selection_mode-manual"
								label={ __( "Manual selection", "wordpress-seo" ) }
								value="manual"
								disabled={ ! isLlmsTxtEnabled }
							/>
						</RadioGroup>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default LlmTxt;
