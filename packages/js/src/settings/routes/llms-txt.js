import { ExternalLinkIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useCallback, useEffect, useMemo, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, Radio, RadioGroup, ToggleField } from "@yoast/ui-library";
import classNames from "classnames";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { withDisabledMessageSupport } from "../hocs";
import { FieldArray, Field, useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikIndexablePageSelectField,
	FormLayout,
	RouteLayout,
	LlmTxtPopover,
} from "../components";
import { useDispatchSettings, useSelectSettings } from "../hooks";
import { FormikValueChangeField } from "../../shared-admin/components/form";

const FormikValueChangeFieldWithDisabledMessage = withDisabledMessageSupport( FormikValueChangeField );

const LABEL = "llms.txt";
const UNIQUE_PAGES = [
	"about_us_page",
	"contact_page",
	"terms_page",
	"privacy_policy_page",
	"shop_page",
	"other_included_pages",
];

/**
 * @returns {JSX.Element} The llms.txt feature route.
 */
// eslint-disable-next-line complexity
const LlmTxt = () => {
	const hasLoadedIndexablePages = useRef( false );
	const otherIncludedPagesLimit = useSelectSettings( "selectLlmsTxtOtherIncludedPagesLimit", [] );
	const disabledPageIndexables = useSelectSettings( "selectLlmsTxtDisabledPageIndexables", [] );
	const llmsTxtUrl = useSelectSettings( "selectLlmsTxtUrl", [] );
	const seeMoreLink = useSelectSettings( "selectLink", [], "https://yoa.st/llmstxt-learn-more" );
	const bestPracticesLink = useSelectSettings( "selectLink", [], "https://yoa.st/llmstxt-best-practices" );

	const { fetchIndexablePages } = useDispatchSettings();

	const { values, initialValues } = useFormikContext();
	const {
		"noindex-page": noindexPages,
	} = values.wpseo_titles;

	const {
		llms_txt_selection_mode: llmsTxtSelectionMode,
		other_included_pages: otherIncludedPages,
	} = values.wpseo_llmstxt;
	const { enable_llms_txt: isLlmsTxtEnabled } = values.wpseo;
	const { enable_llms_txt: initialIsLlmsTxtEnabled } = initialValues.wpseo;

	/** @type {number[]} */
	const selectedIndexablePageIds = useMemo(
		/**
		 * Extracts the selected indexable page IDs for the llms.txt feature.
		 * - Using a Set to ensure unique page IDs.
		 * - Flattening due to `other_included_pages` being an array of IDs.
		 * - Filtering out 0: it is our placeholder for empty selections.
		 * @returns {number[]} The unique selected indexable page IDs.
		 */
		() => Array.from( new Set( UNIQUE_PAGES.map( ( page ) => values.wpseo_llmstxt[ page ] ).flat().filter( ( id ) => id !== 0 ) ) ),
		[ values.wpseo_llmstxt ]
	);

	const activeTxtButton = useMemo( () => (
		initialIsLlmsTxtEnabled && isLlmsTxtEnabled
	), [ initialIsLlmsTxtEnabled, isLlmsTxtEnabled ] );

	const disabledPages = useMemo( () => (
		disabledPageIndexables || noindexPages
	), [ disabledPageIndexables, noindexPages ] );

	const disabledSelection = useMemo( () => (
		! isLlmsTxtEnabled || disabledPages
	), [ isLlmsTxtEnabled, disabledPages ] );

	const activeManualSelection = useMemo( () => (
		isLlmsTxtEnabled && ! disabledPages && llmsTxtSelectionMode === "manual"
	), [ isLlmsTxtEnabled, disabledPages, llmsTxtSelectionMode ] );

	const featureDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %3$s are replaced by opening and closing <a> tags, %2$s is replaced by "llms.txt". */
			__( "Future-proof your website for visibility in AI tools like ChatGPT and Google Gemini. This helps them provide better, more accurate information about your site. %1$sLearn more about the %2$s file%3$s.", "wordpress-seo" ),
			"<a>",
			LABEL,
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-settings-info" href={ seeMoreLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [ seeMoreLink ] );
	const selectionDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags, %3$s is replaced by "llms.txt".. */
			__( "Generate an automatic page selection based on %1$sYoast SEO’s best practices%2$s, or manually choose the pages to be included in your %3$s file.", "wordpress-seo" ),
			"<a>",
			"</a>",
			LABEL
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-best-practices" href={ bestPracticesLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [ bestPracticesLink ] );

	const disabledPagesAlert = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags */
			__( "Pages are %1$sdisabled from being shown in the search results%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="llms-noindex-pages" href={ "admin.php?page=wpseo_page_settings#/post-type/pages#input-wpseo_titles-noindex-page" } />,
		}
	), [] );

	const handleAddPage = useCallback( async( arrayHelpers ) => {
		// Async/await is needed to ensure the new field is rendered before clicking it.
		await arrayHelpers.push( 0 );
		document.querySelector( `[data-id="input-wpseo_llmstxt-other_included_pages-${ otherIncludedPages.length }"]` )?.click();
	}, [ otherIncludedPages ] );

	useEffect( () => {
		// Get initial options.
		if ( isLlmsTxtEnabled && llmsTxtSelectionMode === "manual" && ! hasLoadedIndexablePages.current ) {
			hasLoadedIndexablePages.current = true;
			fetchIndexablePages();
		}
	}, [ fetchIndexablePages, isLlmsTxtEnabled, llmsTxtSelectionMode ] );

	const isOptIn = useMemo( () => ! isLlmsTxtEnabled && sessionStorage?.getItem( "yoast-highlight-setting" ) === "llm-txt", [ isLlmsTxtEnabled ] );

	return (
		<RouteLayout
			title={ LABEL }
			description={ featureDescription }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-space-y-8">

						<div className="yst-relative yst-max-w-sm">
							<FormikValueChangeFieldWithDisabledMessage
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_llms_txt"
								id="input-wpseo.enable_llms_txt"
								label={ sprintf(
								// translators: %1$s expands to "llms.txt".
									__( "Enable %1$s file feature", "wordpress-seo" ),
									LABEL
								) }
								description={ sprintf(
									// translators: %1$s expands to "llms.txt".
									__(
										"Enabling this feature generates and updates an %1$s file weekly that lists a selection of your site's content.",
										"wordpress-seo"
									),
									LABEL
								) }
								className={ isOptIn ? "yst-popover-backdrop-highlight-button" : "" }
							/>
							{ isOptIn && <LlmTxtPopover /> }
						</div>
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
							LABEL
						) }
						<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-slate-400 rtl:yst-rotate-[270deg]" />
					</Button>
					{ ( ! initialIsLlmsTxtEnabled && isLlmsTxtEnabled ) &&
						<Alert id="llms-txt-save-changes-aler" variant="info" className="yst-mt-4 yst-max-w-md">
							{ sprintf(
								// translators: %1$s expands to "llms.txt".
								__( "By saving your changes we will generate your %1$s file.", "wordpress-seo" ),
								LABEL
							) }
						</Alert> }
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ sprintf(
							// translators: %1$s expands to "llms.txt".
							__( "%1$s page selection", "wordpress-seo" ),
							LABEL
						) }
						description={ selectionDescription }
					>
						{ ( disabledPages ) && <Alert id="llms-txt-disabled-pages-alert" variant="info" className="yst-max-w-md">
							{ disabledPagesAlert }
						</Alert> }
						<RadioGroup disabled={ disabledSelection }>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo_llmstxt.llms_txt_selection_mode"
								id="input-wpseo_llmstxt-llms_txt_selection_mode-auto"
								label={ __( "Automatic page selection", "wordpress-seo" ) }
								value="auto"
								disabled={ disabledSelection }
							/>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo_llmstxt.llms_txt_selection_mode"
								id="input-wpseo_llmstxt-llms_txt_selection_mode-manual"
								label={ __( "Manual page selection", "wordpress-seo" ) }
								value="manual"
								disabled={ disabledSelection }
							/>
						</RadioGroup>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Manual page selection", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to "llms.txt".
							__( "Select the pages that you want to include in the %1$s file", "wordpress-seo" ),
							LABEL
						) }
					>
						<>
							<FormikIndexablePageSelectField
								name="wpseo_llmstxt.about_us_page"
								id="input-wpseo_llmstxt-about_us_page"
								label={ __( "About us page", "wordpress-seo" ) }
								className="yst-max-w-sm"
								disabled={ ! activeManualSelection }
								selectedIds={ selectedIndexablePageIds }
							/>
							<FormikIndexablePageSelectField
								name="wpseo_llmstxt.contact_page"
								id="input-wpseo_llmstxt-contact_page"
								label={ __( "Contact page", "wordpress-seo" ) }
								className="yst-max-w-sm"
								disabled={ ! activeManualSelection }
								selectedIds={ selectedIndexablePageIds }
							/>
							<FormikIndexablePageSelectField
								name="wpseo_llmstxt.terms_page"
								id="input-wpseo_llmstxt-terms_page"
								label={ __( "Terms page", "wordpress-seo" ) }
								className="yst-max-w-sm"
								disabled={ ! activeManualSelection }
								selectedIds={ selectedIndexablePageIds }
							/>
							<FormikIndexablePageSelectField
								name="wpseo_llmstxt.privacy_policy_page"
								id="input-wpseo_llmstxt-privacy_policy_page"
								label={ __( "Privacy policy", "wordpress-seo" ) }
								className="yst-max-w-sm"
								disabled={ ! activeManualSelection }
								selectedIds={ selectedIndexablePageIds }
							/>
							<FormikIndexablePageSelectField
								name="wpseo_llmstxt.shop_page"
								id="input-wpseo_llmstxt-shop_page"
								label={ __( "Shop page", "wordpress-seo" ) }
								className="yst-max-w-sm"
								disabled={ ! activeManualSelection }
								selectedIds={ selectedIndexablePageIds }
							/>
							<hr className="yst-my-8 yst-max-w-md" />
							<FieldArray name="wpseo_llmstxt.other_included_pages">
								{ arrayHelpers => (
									<>
										<div className="yst-space-y-4">
											{ otherIncludedPages.map( ( _, index ) => (
												<div
													className="yst-w-full yst-flex yst-items-start yst-gap-2 yst-mt-2"
													key={ `wpseo_llmstxt.other_included_pages.${ index }` }
												>
													<FormikIndexablePageSelectField
														name={ `wpseo_llmstxt.other_included_pages.${ index }` }
														id={ `input-wpseo_llmstxt-other_included_pages-${ index }` }
														label={ index === 0 ? __( "Content pages", "wordpress-seo" ) : "" }
														className="yst-max-w-sm yst-flex-grow"
														disabled={ ! activeManualSelection }
														selectedIds={ selectedIndexablePageIds }
													/>
													<Button
														variant="secondary"
														// eslint-disable-next-line react/jsx-no-bind
														onClick={ arrayHelpers.remove.bind( null, index ) }
														className={ classNames( "yst-p-2.5", index === 0 && "yst-mt-7" ) }
														// translators: %1$s expands to array index + 1.
														aria-label={ sprintf( __( "Remove page %1$s", "wordpress-seo" ), index + 1 ) }
														disabled={ ! activeManualSelection }
													>
														<TrashIcon className="yst-h-5 yst-w-5" />
													</Button>
												</div>
											) ) }
											{ ( otherIncludedPages.length < otherIncludedPagesLimit ) && <Button
												id="button-add-page"
												variant="secondary"
												/* eslint-disable-next-line react/jsx-no-bind */
												onClick={ () => handleAddPage( arrayHelpers ) }
												disabled={ ! activeManualSelection }
											>
												<PlusIcon className="yst--ms-1 yst-me-1 yst-h-5 yst-w-5 yst-text-slate-400" />
												{ __( "Add page", "wordpress-seo" ) }
											</Button> }
										</div>
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
