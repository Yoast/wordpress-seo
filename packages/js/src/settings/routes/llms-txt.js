import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { Fragment, useCallback } from "@wordpress/element";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useEffect, useMemo } from "@wordpress/element";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, Radio, RadioGroup, ToggleField } from "@yoast/ui-library";
import { FieldArray, Field, useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikIndexablePageSelectField,
	FormikValueChangeField,
	FormLayout,
	RouteLayout,
} from "../components";
import { useDispatchSettings, useSelectSettings } from "../hooks";

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

	const { fetchIndexablePages } = useDispatchSettings();

	const { values, initialValues } = useFormikContext();
	const { other_included_pages: otherIncludedPages } = values.wpseo_llmstxt;
	const {
		enable_llms_txt: isLlmsTxtEnabled
	} = values.wpseo;

	const {
		enable_llms_txt: initialIsLlmsTxtEnabled
	} = initialValues.wpseo;

	const {
		llms_txt_selection_mode: llmsTxtSelectionMode
	} = values.wpseo_llmstxt;

	// eslint-disable-next-line no-console
	console.log( "hasGenerationFailed", hasGenerationFailed );
	// eslint-disable-next-line no-console
	console.log( "generationFailureReason", generationFailureReason );
	// eslint-disable-next-line no-console
	console.log( "llmsTxtSelectionMode", llmsTxtSelectionMode );

	const activeTxtButton = useMemo( () => (
		initialIsLlmsTxtEnabled && isLlmsTxtEnabled
	), [ initialIsLlmsTxtEnabled, isLlmsTxtEnabled ] );

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

	const handleAddPage = useCallback( async( pageArrayHelpers ) => {
		await pageArrayHelpers.push( "" );
		document.getElementById( `input-wpseo_llmstxt-other_included_pages-${ otherIncludedPages.length }` )?.focus();
	}, [ otherIncludedPages ] );

	useEffect( () => {
		// Get initial options.
		fetchIndexablePages();
	}, [ fetchIndexablePages ] );

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
								name="wpseo_llmstxt.llms_txt_selection_mode"
								id="input-wpseo_llmstxt-llms_txt_selection_mode-auto"
								label={ __( "Automatic selection", "wordpress-seo" ) }
								value="auto"
								disabled={ ! isLlmsTxtEnabled }
							/>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo_llmstxt.llms_txt_selection_mode"
								id="input-wpseo_llmstxt-llms_txt_selection_mode-manual"
								label={ __( "Manual selection", "wordpress-seo" ) }
								value="manual"
								disabled={ ! isLlmsTxtEnabled }
							/>
						</RadioGroup>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Manual page selection", "wordpress-seo" ) }
						description={ __( "Select the pages that you want to include in the llms.txt file.", "wordpress-seo" ) }
					>
							<>
								<FormikIndexablePageSelectField
									name={ `wpseo_llmstxt.about_us_page` }
									id={ `input-wpseo_llmstxt-about_us_page` }
									label={ __( "About us page", "wordpress-seo" ) }
									className="yst-max-w-sm"
								/>
								<FormikIndexablePageSelectField
									name={ `wpseo_llmstxt.contact_page` }
									id={ `input-wpseo_llmstxt-contact_page` }
									label={ __( "Contact page", "wordpress-seo" ) }
									className="yst-max-w-sm"
								/>
								<FieldArray name="wpseo_llmstxt.other_included_pages">
									{ pageArrayHelpers => (
										<>
											{ otherIncludedPages.map( ( _, index ) => (
												<Transition
													key={ `wpseo_llmstxt.other_included_pages.${ index + 2 }` }
													as={ Fragment }
													appear={ true }
													show={ true }
													enter="yst-transition yst-ease-out yst-duration-300"
													enterFrom="yst-transform yst-opacity-0"
													enterTo="yst-transform yst-opacity-100"
													leave="yst-transition yst-ease-out yst-duration-300"
													leaveFrom="yst-transform yst-opacity-100"
													leaveTo="yst-transform yst-opacity-0"
												>
													<div className="yst-w-full yst-flex yst-items-start yst-gap-2">
														<FormikIndexablePageSelectField
															name={ `wpseo_llmstxt.other_included_pages.${ index + 2 }` }
															id={ `input-wpseo_llmstxt-other_included_pages-${ index + 2 }` }
															// translators: %1$s expands to array index + 3.
															label={ sprintf( __( "Content Page %1$s", "wordpress-seo" ), index + 2 + 1 ) }
															className="yst-max-w-sm"
														/>
														<Button
															variant="secondary"
															// eslint-disable-next-line react/jsx-no-bind
															onClick={ pageArrayHelpers.remove.bind( null, index + 2 ) }
															className="yst-mt-7 yst-p-2.5"
															// translators: %1$s expands to array index + 3.
															aria-label={ sprintf( __( "Remove page %1$s", "wordpress-seo" ), index + 2 + 1 ) }
														>
															<TrashIcon className="yst-h-5 yst-w-5" />
														</Button>
													</div>
												</Transition>
											) ) }
											{ /* eslint-disable-next-line react/jsx-no-bind */ }
											<Button id="button-add-page" variant="secondary" onClick={ ()=>handleAddPage( pageArrayHelpers ) }>
												<PlusIcon className="yst--ms-1 yst-me-1 yst-h-5 yst-w-5 yst-text-slate-400" />
												{ __( "Add page", "wordpress-seo" ) }
											</Button>
										</>
									) }
								</FieldArray>
							</>
					</FieldsetLayout>					
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default LlmTxt;
