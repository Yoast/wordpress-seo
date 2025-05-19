/* eslint-disable complexity, max-statements */
import CheckIcon from "@heroicons/react/outline/esm/CheckIcon";
import RefreshIcon from "@heroicons/react/outline/esm/RefreshIcon";
import { useDispatch } from "@wordpress/data";
import { Fragment, useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, Label, Modal, Notifications, Pagination, useModalContext, usePrevious } from "@yoast/ui-library";
import { map, noop } from "lodash";
import PropTypes from "prop-types";
import { SparksLimitNotification, SuggestionError, SuggestionsList, SuggestionsListSkeleton, TipNotification } from ".";
import {
	ASYNC_ACTION_STATUS,
	EDIT_TYPE,
	FETCH_RESPONSE_STATUS,
	STORE_NAME_AI,
	SUGGESTIONS_PER_PAGE,
	TITLE_VARIABLE,
	TITLE_VARIABLE_REPLACE,
} from "../constants";
import {
	useApplyReplacementVariables,
	useDescriptionTemplate,
	useLocation,
	useMeasuredRef,
	usePagination,
	usePreviewContent,
	useSuggestions,
	useTitleTemplate,
	useTypeContext,
} from "../hooks";
import { useModalApplyButtonLabel } from "../hooks/use-modal-apply-button-label";
import { useModalSuggestionsTitle } from "../hooks/use-modal-suggestions-title";
import { useSetTitleOrDescription } from "../hooks/use-set-title-or-description";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * Aims to capture the text between badges.
 *
 * Start: </badge> or the start of the string (if not <badge>).
 * Text: anything in between.
 * End: <badge> or the end of the string.
 *
 * @type {RegExp}
 */
const BETWEEN_BADGES = /(?<start><\/badge>|^(?!<badge>))(?<wrap>[\s\S]+?)(?<end><badge>|$)/g;

/**
 * @param {number} height The height of the scrolling container above.
 * @returns {JSX.Element} The element.
 */
export const ModalContent = ( { height } ) => {
	const [ initialFetch, setInitialFetch ] = useState( "" );
	const { onClose } = useModalContext();
	const { editType, previewType, contentType } = useTypeContext();
	const suggestionsTitle = useModalSuggestionsTitle();
	const applyButtonLabel = useModalApplyButtonLabel();
	const location = useLocation();
	const { suggestions, fetchSuggestions, setSelectedSuggestion } = useSuggestions();
	const Preview = usePreviewContent();
	const { addAppliedSuggestion, addUsageCount, fetchUsageCount } = useDispatch( STORE_NAME_AI );

	// Used in an attempt to prevent the tip notification from moving too much when generating more suggestions.
	const previousHeight = usePrevious( height );
	const currentHeight = suggestions.status === ASYNC_ACTION_STATUS.success ? height : previousHeight;
	const margin = `calc(${ currentHeight === 0 ? "50%" : currentHeight / 2 + "px" } - 40vh)`;

	const [ contentIsScrolling, setContentIsScrolling ] = useState( false );
	const handleContentMeasureChange = useCallback( entry => {
		setContentIsScrolling( entry.target.offsetHeight !== entry.target.scrollHeight );
	}, [ setContentIsScrolling ] );
	const contentRef = useMeasuredRef( handleContentMeasureChange );

	const titleTemplate = useTitleTemplate();
	const descriptionTemplate = useDescriptionTemplate();

	const applyReplacementVariables = useApplyReplacementVariables();
	const overrides = useMemo( () => editType === EDIT_TYPE.title ? { [ TITLE_VARIABLE[ contentType ] ]: suggestions.selected } : {},
		[ editType, contentType, suggestions.selected ] );

	const title = useMemo( () => applyReplacementVariables( titleTemplate, { overrides, contentType } ),
		[ applyReplacementVariables, titleTemplate, editType, contentType, suggestions.selected ] );
	const titleForLength = useMemo( () => {
		// Exclude the separator and site name for the title length calculation.
		const lengthOverrides = {
			sep: "",
			sitename: "",
		};
		return applyReplacementVariables( titleTemplate, { overrides: { ...overrides, ...lengthOverrides }, contentType } );
	}, [ applyReplacementVariables, titleTemplate, editType, contentType, suggestions.selected ] );
	const description = useMemo(
		() => editType === EDIT_TYPE.description
			? suggestions.selected
			: applyReplacementVariables( descriptionTemplate, { editType: EDIT_TYPE.description } ),
		[ applyReplacementVariables, descriptionTemplate, editType, suggestions.selected ]
	);
	const createTitleSuggestion = useCallback( suggestion => applyReplacementVariables( titleTemplate, {
		overrides: { [ TITLE_VARIABLE[ contentType ] ]: suggestion },
		key: "badge",
		applyPluggable: false,
		contentType,
	} ), [ applyReplacementVariables, titleTemplate, contentType ] );


	const { currentPage, setCurrentPage, isOnLastPage, totalPages, getItemsOnCurrentPage } = usePagination( {
		totalItems: suggestions.status === ASYNC_ACTION_STATUS.loading || suggestions.status === ASYNC_ACTION_STATUS.error
			// Add an extra page in preparation (loading) or for the error.
			? suggestions.entities.length + SUGGESTIONS_PER_PAGE
			: suggestions.entities.length,
		perPage: SUGGESTIONS_PER_PAGE,
	} );
	const suggestionsOnCurrentPage = useMemo( () => map( getItemsOnCurrentPage( suggestions.entities ), suggestion => {
		let label = suggestion;
		if ( editType === EDIT_TYPE.title ) {
			// Use the template with the replacement variables replaced with their label, wrapped by badge.
			label = createTitleSuggestion( suggestion );
			// Wrap the text between the badges in spans.
			label = label.replace( BETWEEN_BADGES, ( match, g1, g2, g3, index, input, { start, wrap, end } ) => {
				const trimmedWrap = wrap.trim();
				// Do not wrap empty space, it makes for bigger gaps.
				return trimmedWrap.length === 0 ? `${ start }${ wrap }${ end }` : `${ start }<span>${ trimmedWrap }</span>${ end }`;
			} );
			// Replace the tags with HTML/elements.
			label = safeCreateInterpolateElement( label, {
				// Note that there is a space inside the badge, this is just so we do not get a React prop warning.

				badge: <Badge className="yst-me-2 last:yst-me-0" variant="plain"> </Badge>,
				span: <span className="yst-flex yst-items-center yst-me-2 last:yst-me-0" />,
			} );
		}
		return ( { value: suggestion, label } );
	} ), [ suggestions.entities, getItemsOnCurrentPage, editType, createTitleSuggestion ] );

	const showSuggestions = useMemo( () => (
		// When not an error.
		suggestions.status !== ASYNC_ACTION_STATUS.error ||
		// Or when an error, but not on the last page.
		( suggestions.status === ASYNC_ACTION_STATUS.error && ! isOnLastPage )
	), [ suggestions.status, isOnLastPage ] );
	const showLoading = useMemo( () => suggestions.status === ASYNC_ACTION_STATUS.loading && isOnLastPage, [ suggestions.status, isOnLastPage ] );
	const showError = useMemo( () => suggestions.status === ASYNC_ACTION_STATUS.error && isOnLastPage, [ suggestions.status, isOnLastPage ] );

	const handleGenerateMore = useCallback( () => {
		/*
		 * This is before the request to give the effect of the new page loading.
		 * Total pages is not yet updated at this point.
		 * Do not add one when the last generate resulted in an error, because the total pages is adjusted for that.
		 */
		setCurrentPage( suggestions.status === ASYNC_ACTION_STATUS.error ? totalPages : totalPages + 1 );
		addUsageCount();
		fetchSuggestions();
	}, [ fetchSuggestions, suggestions.status, totalPages, setCurrentPage, setSelectedSuggestion ] );
	const handleRetryInitialFetch = useCallback( () => setInitialFetch( "" ), [ setInitialFetch ] );

	const setTitleOrDescription = useSetTitleOrDescription();
	const handleApplySuggestion = useCallback( () => {
		const data = editType === EDIT_TYPE.title
			// For terms, remove the "Archives" part from the titleTemplate if present.
			? titleTemplate.replace( new RegExp( TITLE_VARIABLE_REPLACE[ contentType ] + "( Archives)?" ), suggestions.selected )
			: suggestions.selected;
		setTitleOrDescription( data );
		addAppliedSuggestion( { editType, previewType, suggestion: suggestions.selected } );
		onClose();
	}, [ setTitleOrDescription, editType, previewType, suggestions.selected, titleTemplate, onClose, addAppliedSuggestion ] );

	useEffect( () => {
		if ( initialFetch === "" ) {
			fetchSuggestions().then( status => {
				setInitialFetch( status );
				if ( status === FETCH_RESPONSE_STATUS.success ) {
					fetchUsageCount();
				}
			} );
		}
	}, [ initialFetch, setInitialFetch, fetchSuggestions ] );

	// Initial fetch gone wrong OR subscription error on any request.
	if ( initialFetch === FETCH_RESPONSE_STATUS.error || ( suggestions.status === ASYNC_ACTION_STATUS.error && suggestions.error.code === 402 ) ) {
		return (
			<div className="yst-flex yst-flex-col yst-space-y-6 yst-mt-6">
				<SuggestionError
					errorCode={ suggestions.error.code }
					errorIdentifier={ suggestions.error.errorIdentifier }
					invalidSubscriptions={ suggestions.error.missingLicenses }
					showActions={ true }
					onRetry={ handleRetryInitialFetch }
					errorMessage={ suggestions.error.message }
				/>
			</div>
		);
	}

	const suggestionClassNames = [
		[ "yst-h-3 yst-w-9/12" ],
		[ "yst-h-3 yst-w-7/12" ],
		[ "yst-h-3 yst-w-10/12" ],
		[ "yst-h-3 yst-w-11/12" ],
		[ "yst-h-3 yst-w-8/12" ],
	];

	return (
		<Fragment>
			<Modal.Container.Content ref={ contentRef } className="yst-flex yst-flex-col yst-py-6 yst-space-y-2">
				<Preview
					title={ title }
					description={ description }
					status={ suggestions.status }
					titleForLength={ titleForLength }
					showPreviewSkeleton={ initialFetch === "" }
					showLengthProgress={ ! showLoading }
				/>
				{ showSuggestions && (
					showLoading ? <SuggestionsListSkeleton
						idSuffix={ location }
						// eslint-disable-next-line no-undefined
						suggestionClassNames={ editType === EDIT_TYPE.title ? suggestionClassNames : undefined }
					/>
						: ( <>
							<div className="yst-flex yst-space-y-4">
								<Label as="span" className="yst-flex-grow yst-cursor-default yst-mt-auto">
									{ suggestionsTitle }
								</Label>

								<Button
									variant="secondary"
									size="small"
									onClick={ suggestions.status === ASYNC_ACTION_STATUS.loading ? noop : handleGenerateMore }
									isLoading={ suggestions.status === ASYNC_ACTION_STATUS.loading }
								>
									{ suggestions.status !== ASYNC_ACTION_STATUS.loading && (
										<RefreshIcon className="yst--ms-1 yst-me-2 yst-h-4 yst-w-4 yst-text-gray-400" />
									) }
									{ __( "Generate 5 more", "wordpress-seo" ) }
								</Button>
							</div>

							<SuggestionsList
								idSuffix={ location }
								suggestions={ suggestionsOnCurrentPage }
								selected={ suggestions.selected }
								onChange={ setSelectedSuggestion }
							/>
							<div className="yst-flex yst-justify-between yst-gap-x-2 yst-items-start">
								<p className="yst-text-slate-500 yst-text-[11px] yst-mt-1">
									{ __( "Text generated by AI may be offensive or inaccurate.", "wordpress-seo" ) }
								</p>
								{ totalPages > 1 && (
									<Pagination
										className="yst-shrink-0"
										current={ currentPage }
										total={ totalPages }
										onNavigate={ setCurrentPage }
										disabled={ suggestions.status === ASYNC_ACTION_STATUS.loading }
										variant="text"
										/* translators: Hidden accessibility text. */
										screenReaderTextPrevious={ __( "Previous", "wordpress-seo" ) }
										/* translators: Hidden accessibility text. */
										screenReaderTextNext={ __( "Next", "wordpress-seo" ) }
									/>
								) }
							</div>
						</>
						)
				) }
				{ ( suggestions.status === ASYNC_ACTION_STATUS.error && isOnLastPage ) && (
					<SuggestionError
						errorCode={ suggestions.error.code }
						errorIdentifier={ suggestions.error.errorIdentifier }
						invalidSubscriptions={ suggestions.error.missingLicenses }
						errorMessage={ suggestions.error.message }
					/>
				) }
			</Modal.Container.Content>
			<Modal.Container.Footer>
				{ contentIsScrolling && (
					// Prevent the fade from going over the scrollbar: margin-right of the padding of the content, minus the border width.
					<div
						className={
							"yst-absolute yst-inset-x-0 yst--mt-10 yst-me-[calc(2.5rem-1px)] yst-h-10 yst-pointer-events-none " +
							"yst-bg-gradient-to-t yst-from-slate-50"
						}
					/>
				) }
				<hr className="yst-mb-6 yst--mx-6" />
				<div className="sm:yst-flex sm:yst-justify-end sm:yst-space-x-2 sm:rtl:yst-space-x-reverse">
					<div className="yst-hidden sm:yst-inline">
						<Button variant="secondary" onClick={ onClose }>
							{ __( "Close", "wordpress-seo" ) }
						</Button>
					</div>
					<div className="yst-block sm:yst-inline">
						<Button
							className="yst-w-full sm:yst-w-auto"
							variant="primary"
							onClick={ handleApplySuggestion }
							disabled={
								// When no suggestion is selected.
								suggestions.selected === "" ||
								// Or when loading.
								suggestions.status === ASYNC_ACTION_STATUS.loading ||
								// Or when an error occurred and viewing the last page.
								showError
							}
						>
							<CheckIcon className="yst--ms-1 yst-me-1 yst-h-4 yst-w-4 yst-text-white" />
							{ applyButtonLabel }
						</Button>
					</div>
					<div className="yst-mt-3 sm:yst-hidden">
						<Button variant="secondary" onClick={ onClose } className="yst-w-full sm:yst-w-auto">
							{ __( "Close", "wordpress-seo" ) }
						</Button>
					</div>
				</div>
			</Modal.Container.Footer>
			<Notifications
				className={
				// Margin tricks to break out of the container. Transition to prevent sudden location jumps when loading new suggestions.
					"yst-mx-[calc(50%-50vw)] yst-transition-all"
				}
				style={ {
				// Margin tricks to break out of the container.
					marginTop: margin,
				} }
				position="bottom-left"
			>
				{ suggestions.status !== ASYNC_ACTION_STATUS.loading && <SparksLimitNotification
					className="yst-mx-[calc(50%-50vw)] yst-transition-all"
				/> }
				{ ( suggestions.status === ASYNC_ACTION_STATUS.success || suggestions.status === ASYNC_ACTION_STATUS.loading ) &&
					<TipNotification />
				}
			</Notifications>
		</Fragment>
	);
};
ModalContent.propTypes = {
	height: PropTypes.number.isRequired,
};
