/* eslint-disable camelcase */
import { Spinner } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { useRedirectFilters } from "../hooks";
import { useCallback, useState, useRef } from "@wordpress/element";
import { FORMAT_PLAIN  } from "../constants";
import { Form, Formik } from "formik";
import { handleEditSubmit, updateValidationSchema } from "../helpers";
import { DeleteModal } from "./delete-modal";
import { TableRedirects } from "./table-redirects";

/**
 * ListRedirects — A component for displaying and managing a list of redirects.
 *
 * This component renders a table of sorted redirect entries. It supports:
 * - Editing a redirect via a form inside a table row.
 * - Selecting individual or all redirects.
 * - Deleting single redirects with a confirmation modal.
 * - Sorting the list by redirect type/order.
 *
 * @returns {JSX.Element} The rendered table of list redirects.
*/
export const ListRedirects = () => {
	const {
		sortedRedirects,
		sortOrder,
		toggleSortOrder,
		onDelete,
		selectedRedirects,
		status,
		isDeleteRedirectsLoading,
		setters: { toggleSelectRedirect, clearSelectedRedirects, setSelectedRedirects },
	} = useRedirectFilters();

	const redirectsLength = sortedRedirects?.length;
	const [ selectedRedirect, setSelectedRedirect ] = useState( {} );
	const [ selectedDeleteRedirect, setSelectedDeleteRedirect ] = useState( {} );
	const [ showDeleteModal, setShowDeleteModal ] = useState( false );
	const [ isDeleteLoading, setIsDeleteLoading ] = useState( false );
	const isLoading = status !== "success" || isDeleteRedirectsLoading;

	const focusElementRef = useRef( null );
	const label = sprintf(
		/* translators: 1: Label items, 2: Yoast SEO */
		__( "%1$d Item%2$s", "wordpress" ),
		redirectsLength,
		redirectsLength > 1 ? "s" : ""
	);

	const onSubmit = useCallback( async( values, { resetForm } ) => {
		const mappedValues = {
			old_target: values.target,
			old_origin: values.origin,
			old_type: values.type,
			new_target: values.newTarget,
			new_origin: values.newOrigin,
			new_type: values.newType,
			format: values.format,
		};

		const result = await handleEditSubmit( mappedValues, { resetForm } );
		if ( ! result ) {
			return;
		}
		setSelectedRedirect( {} );
	}, [] );

	const handleDeleteModal = useCallback( () => {
		setShowDeleteModal( ( prev ) => ! prev );
	}, [] );

	const handleConfirmDelete = useCallback( async() => {
		if ( ! selectedDeleteRedirect?.origin ) {
			return;
		}
		try {
			setIsDeleteLoading( true );
			await onDelete( selectedDeleteRedirect.origin );
			handleDeleteModal();
		} finally {
			setIsDeleteLoading( false );
		}
	}, [ selectedDeleteRedirect, onDelete ] );

	if ( isLoading ) {
		return (
			<div className="yst-flex yst-items-center yst-justify-center yst-mt-4">
				<Spinner size="8" />
			</div>
		);
	}

	return (
		<>
			{ redirectsLength > 0 && <div className="yst-text-slate-500 yst-mt-4">{ label }</div> }
			<Formik
				initialValues={ {
					target: selectedRedirect.target,
					origin: selectedRedirect.origin,
					type: selectedRedirect.type,
					newTarget: selectedRedirect.target,
					newType: selectedRedirect.type,
					newOrigin: selectedRedirect.origin,
					format: FORMAT_PLAIN } }
				onSubmit={ onSubmit }
				enableReinitialize={ true }
				validationSchema={ updateValidationSchema( {} ) }
			>
				<Form>
					<TableRedirects
						selectedRedirect={ selectedRedirect }
						setSelectedRedirect={ setSelectedRedirect }
						handleDeleteModal={ handleDeleteModal }
						setSelectedDeleteRedirect={ setSelectedDeleteRedirect }
						sortOrder={ sortOrder }
						toggleSortOrder={ toggleSortOrder }
						selectedRedirects={ selectedRedirects }
						toggleSelectRedirect={ toggleSelectRedirect }
						clearSelectedRedirects={ clearSelectedRedirects }
						setSelectedRedirects={ setSelectedRedirects }
						sortedRedirects={ sortedRedirects }
					/>
					<DeleteModal
						isOpen={ showDeleteModal }
						onClose={ handleDeleteModal }
						onConfirm={ handleConfirmDelete }
						isLoading={ isDeleteLoading }
						redirectOrigin={ selectedDeleteRedirect.origin }
						focusRef={ focusElementRef }
					/>
				</Form>
			</Formik>
		</>
	);
};
