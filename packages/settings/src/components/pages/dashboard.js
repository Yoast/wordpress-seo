import { ExclamationIcon } from "@heroicons/react/outline";
import { useDispatch, useSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Modal, Page, Section as PureSection, Spinner } from "@yoast/admin-ui-toolkit/components";
import { isLoadingStatus } from "@yoast/admin-ui-toolkit/helpers";
import { REDUX_STORE_KEY } from "../../constants";
import withHideForOptions from "../../helpers/with-hide-for-options";

const Section = withHideForOptions()( PureSection );

/**
 * @returns {JSX.Element} Theme modifications section content.
 */
const ThemeModifications = () => {
	const isActive = useSelect( select => select( REDUX_STORE_KEY ).getOption( "dashboard.themeModificationsActive" ) );
	const applyStatus = useSelect( select => select( REDUX_STORE_KEY ).getThemeModificationsStatus( "apply" ) );
	const removeStatus = useSelect( select => select( REDUX_STORE_KEY ).getThemeModificationsStatus( "remove" ) );
	const { applyThemeModifications, removeThemeModifications } = useDispatch( REDUX_STORE_KEY );

	const [ isOpen, setOpen ] = useState( false );
	const openModal = useCallback( () => setOpen( true ), [ setOpen ] );
	const closeModal = useCallback( () => setOpen( false ), [ setOpen ] );
	const uninstall = useCallback( () => {
		closeModal();
		removeThemeModifications();
	}, [ closeModal, removeThemeModifications ] );

	const isApplying = isLoadingStatus( applyStatus );
	const isRemoving = isLoadingStatus( removeStatus );

	return <>
		{ ! isActive && <Alert type="error">
			<div>
				<p>{
					__( "When you're not in the process of removing this app, please be aware that all your theme modifications have been removed. This means the Yoast SEO app is non-functional right now. When you want a functioning app again, please click on the 'Reapply theme modifications' button below.", "admin-ui" )
				}</p>
			</div>
		</Alert> }
		<div className="yst-mb-4">
			<button
				type="button"
				className="yst-button yst-button--secondary"
				disabled={ isApplying || isRemoving }
				onClick={ applyThemeModifications }
			>
				{ isApplying && <Spinner color="black" className="yst-mr-3" /> }
				{ __( "Reapply theme modifications", "admin-ui" ) }
			</button>
		</div>
		{ isActive && <div className="yst-mb-4">
			<button
				type="button"
				className="yst-button yst-button--danger"
				disabled={ isApplying || isRemoving }
				onClick={ openModal }
			>
				{ isRemoving && <Spinner className="yst-mr-3" /> }
				{ __( "Uninstall theme modifications", "admin-ui" ) }
			</button>
		</div> }

		<Modal isOpen={ isOpen } hasCloseButton={ true } handleClose={ closeModal }>
			<div className="sm:yst-flex sm:yst-items-start">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" aria-hidden="true" />
				</div>
				<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ml-4 sm:yst-text-left">
					<Modal.Title as="h3" className="yst-text-lg yst-leading-6 yst-font-medium yst-text-gray-900">
						{ __( "Uninstall theme modifications", "admin-ui" ) }
					</Modal.Title>
					<div className="yst-mt-2">
						<p className="yst-text-sm yst-text-gray-500 yst-pb-4">
							{ __( "You're about to permanently remove all modifications that Yoast SEO made to your theme. Normally, you will most likely do this when you're about to uninstall Yoast SEO.", "admin-ui" ) }
						</p>
						<p className="yst-text-sm yst-text-gray-500">
							{ __( "Are you sure you want to do this?", "admin-ui" ) }
						</p>
					</div>
				</div>
			</div>

			<div className="yst-mt-8 sm:yst-mt-6 sm:yst-flex sm:yst-flex-row-reverse">
				<button
					type="button"
					className="yst-button yst-button--danger yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-ml-3"
					onClick={ uninstall }
				>
					{ __( "Yes, uninstall theme modifications", "admin-ui" ) }
				</button>
				<button
					type="button"
					className="yst-button yst-button--secondary yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-mt-0"
					onClick={ closeModal }
				>
					{ __( "Cancel", "admin-ui" ) }
				</button>
			</div>
		</Modal>
	</>;
};

/**
 * The Dashboard page.
 * @returns {*} The Dashboard page.
 */
export default function Dashboard() {
	const cmsName = useSelect( select => select( REDUX_STORE_KEY ).getOption( "dashboard.cmsName" ) );
	const themeModificationsInfoLink = useSelect( select => select( REDUX_STORE_KEY ).getOption( "dashboard.themeModificationsInfoLink" ) );

	return (
		<Page>
			<Page.Header
				title={ __( "Dashboard", "admin-ui" ) }
				description={ __( "A general overview of your Yoast SEO app", "admin-ui" ) }
			/>

			<Section
				title={ __( "Important information", "admin-ui" ) }
				optionPath="dashboard.info"
			>
				<Alert type="info">
					<div>
						<p>{
							sprintf(
								// translators: %1$s is replaced by the name of the CMS.
								__( "Please note: this app will overwrite your general settings from %1$s. If you want to use your general settings from %1$s for a certain entry, please leave that field blank in Yoast SEO.", "admin-ui" ),
								cmsName,
							)
						}</p>
					</div>
				</Alert>
			</Section>

			<Section
				title={ __( "Theme modifications", "admin-ui" ) }
				description={ createInterpolateElement(
					// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
					sprintf(
						__( "Uninstall or reapply our modifications to your theme. %1$sRead more about uninstalling%2$s", "admin-ui" ),
						"<a>",
						"</a>",
					),
					{
						/* eslint-disable-next-line jsx-a11y/anchor-has-content */
						a: <a href={ themeModificationsInfoLink } target="_blank" rel="noopener noreferrer" />,
					},
				) }
				optionPath="dashboard.themeModifications"
			>
				<ThemeModifications />
			</Section>
		</Page>
	);
}
