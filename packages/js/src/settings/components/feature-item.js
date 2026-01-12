/* eslint-disable complexity */
import { useMemo, useCallback, useState } from "@wordpress/element";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { useDisabledMessage, useSelectSettings, useToggleHandlerWithModals } from "../hooks";
import { get } from "lodash";
import { Button, Link, Title, ToggleField, useSvgAria } from "@yoast/ui-library";
import { LockOpenIcon, ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { FormikValueChangeField } from "../../shared-admin/components/form";

const gradientClasses = {
	"ai-tools": "yst-bg-ai-500",
	"content-optimization": "yst-bg-gradient-content-optimization",
	"technical-seo": "yst-bg-gradient-technical-seo",
	"social-sharing": "yst-bg-gradient-social-sharing",
	"site-structure": "yst-bg-gradient-site-structure",
	tools: "yst-bg-gradient-tools",
};

/**
 * @param {string} id The ID.
 * @param {string} link The link URL.
 * @param {string} ariaLabel The aria label for the link a11y.
 * @param {...Object} [props] Additional props.
 * @returns {JSX.Element} The learn more link.
 */
const LearnMoreLink = ( { id, url, ariaLabel, ...props } ) => {
	const href = useSelectSettings( "selectLink", [ url ], url );

	return (
		<Link
			id={ id }
			href={ href }
			variant="primary"
			className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			target="_blank"
			rel="noopener"
			aria-label={
				sprintf(
					/* translators: Hidden accessibility text; %s expands to a translated string of this feature, e.g. "SEO analysis". */
					__( "Learn more about %s (Opens in a new browser tab)", "wordpress-seo" ),
					ariaLabel
				)
			}
			{ ...props }
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
		</Link>
	);
};

/**
 *
 * @param {string} name The feature setting name.
 * @param {string} id The feature item ID.
 * @param {string} inputId The feature toggle input ID.
 * @param {boolean} isPremiumFeature Whether the feature is a premium feature.
 * @param {string} isPremiumLink The link URL for the premium upsell.
 * @param {string} title The feature title.
 * @param {string} description The feature description.
 * @param {string} learnMoreUrl The URL for the learn more link.
 * @param {string} learnMoreLinkId The ID for the learn more link.
 * @param {string} learnMoreLinkAriaLabel The aria label for the learn more link.
 * @param {JSX.Element} children Additional children to render below the description.
 * @param {JSX.ElementClass} Icon The feature icon component.
 * @param {string} featureSectionId The feature section ID.
 * @param {Function} [disableConfirmationModal] Render function for the confirmation modal when disabling the feature.
 * @param {Function} [programmaticallyDisabledModal] Render function for the modal when the feature is disabled programmatically.
 *
 * @returns {JSX.Element} The feature row component.
 */

export const FeatureItem = ( {
	name,
	id,
	inputId,
	isPremiumFeature = false,
	isPremiumLink = "",
	title,
	description,
	learnMoreUrl,
	learnMoreLinkId,
	learnMoreLinkAriaLabel,
	children,
	Icon,
	featureSectionId,
	disableConfirmationModal = null,
	programmaticallyDisabledModal = null,
} ) => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const { isDisabled, disabledSetting } = useDisabledMessage( { name } );
	const { values, setFieldValue } = useFormikContext();
	const isPremiumHref = useSelectSettings( "selectLink", [ isPremiumLink ], isPremiumLink );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const svgAriaProps = useSvgAria();
	const value = useMemo( () => get( values, name, false ), [ values, name ] );
	const shouldUpsell = useMemo( () => ! isPremium && isPremiumFeature, [ isPremium, isPremiumFeature ] );
	const shouldDimHeaderImage = useMemo( () => shouldUpsell || isDisabled || ! value, [ isDisabled, shouldUpsell, value ] );
	const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState( false );
	const [ isProgrammaticallyDisabledModalOpen, setIsProgrammaticallyDisabledModalOpen ] = useState( false );
	const showConfirmationModal = Boolean( disableConfirmationModal );
	const showProgrammaticallyDisabledModal = Boolean( programmaticallyDisabledModal );

	const handleToggleChange = useToggleHandlerWithModals( {
		isDisabledProgrammatically: showProgrammaticallyDisabledModal,
		confirmBeforeDisable: showConfirmationModal,
		fieldName: name,
		setFieldValue,
		onShowProgrammaticallyDisabledModal: useCallback( () => setIsProgrammaticallyDisabledModalOpen( true ), [] ),
		onShowDisableConfirmModal: useCallback( () => setIsConfirmModalOpen( true ), [] ),
	} );

	const handleModalClose = useCallback( () => {
		setIsConfirmModalOpen( false );
	}, [] );

	const handleModalConfirm = useCallback( () => {
		setFieldValue( name, false );
		setIsConfirmModalOpen( false );
	}, [ setFieldValue, name ] );

	const handleProgrammaticallyDisabledModalClose = useCallback( () => {
		setIsProgrammaticallyDisabledModalOpen( false );
	}, [] );

	const toggleProps = {
		id: inputId,
		"aria-label": `${ __( "Enable feature", "wordpress-seo" ) } ${ title }`,
		disabled: isDisabled,
		label: "",
	};

	return <div id={ id } className="yst-flex yst-gap-4 yst-items-start">
		{ Icon && featureSectionId &&
			<div className="yst-relative yst-shrink-0 yst-w-[42px] yst-h-[42px]">
				<div
					className={ classNames(
						shouldDimHeaderImage ? "yst-opacity-0" : "",
						gradientClasses[ featureSectionId ],
						"yst-w-[42px] yst-h-[42px] yst-transition-opacity yst-duration-200 yst-rounded-md" ) }
				/>
				<Icon
					className={ classNames(
						"yst-absolute yst-top-0 yst-flex-shrink-0 yst-rounded-md yst-border-none yst-transition-colors yst-duration-200",
						shouldDimHeaderImage ? "yst-opacity-50 yst-bg-slate-400" : "yst-bg-transparent" ) }
					{ ...svgAriaProps }
				/></div>
		}
		<div className="yst-grow">
			<div className="yst-max-w-lg">
				<Title as="h3" className="yst-mb-1">{ title }</Title>
				<p className="yst-mb-1">{ description }</p>
				{ learnMoreUrl && <LearnMoreLink id={ learnMoreLinkId } url={ learnMoreUrl } ariaLabel={ learnMoreLinkAriaLabel } /> }
				{ shouldUpsell && (
					<Button
						as="a"
						className="yst-gap-2 yst-mt-4"
						variant="upsell"
						href={ isPremiumHref }
						target="_blank"
						rel="noopener"
						size="small"
						{ ...premiumUpsellConfig }
					>
						<LockOpenIcon className="yst-w-4 yst-h-4 yst--ms-1 yst-shrink-0" { ...svgAriaProps } />
						{ sprintf(
						/* translators: %1$s expands to Premium. */
							__( "Unlock with %1$s", "wordpress-seo" ),
							"Premium"
						) }
					</Button>
				) }
				{ children }
			</div>
		</div>
		<div>
			{ ! shouldUpsell && ! showConfirmationModal && <FormikValueChangeField
				{ ...toggleProps }
				as={ ToggleField }
				type="checkbox"
				name={ name }
				checked={ disabledSetting === "language" || showProgrammaticallyDisabledModal ? false : value }
			/> }
			{ ! shouldUpsell && showConfirmationModal && <ToggleField
				{ ...toggleProps }
				checked={ disabledSetting === "language" || showProgrammaticallyDisabledModal ? false : value }
				onChange={ handleToggleChange }
			/> }
			{ showConfirmationModal && disableConfirmationModal( {
				isOpen: isConfirmModalOpen,
				onClose: handleModalClose,
				onConfirm: handleModalConfirm,
			} ) }
			{ showProgrammaticallyDisabledModal && programmaticallyDisabledModal( {
				isOpen: isProgrammaticallyDisabledModalOpen,
				onClose: handleProgrammaticallyDisabledModalClose,
			} ) }
		</div>
	</div>;
};
