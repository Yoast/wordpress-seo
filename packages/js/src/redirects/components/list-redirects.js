/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { Pagination, Spinner } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { usePagination, useRedirectFilters } from "../hooks";
import { useCallback, useState, useRef } from "@wordpress/element";
import { FORMAT_PLAIN, ITEMS_PER_PAGE  } from "../constants";
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
 * @param {string} format - The format of the redirects being managed. Can be "plain" or "regex".
 *
 * @returns {JSX.Element} The rendered table of list redirects.
*/
export const ListRedirects = ( { format = FORMAT_PLAIN } ) => {
	const {
		sortedRedirects,
		sortOrder,
		toggleSortOrder,
		onDelete,
		selectedRedirects,
		isLoading,
		setters: { toggleSelectRedirect, clearSelectedRedirects, setSelectedRedirects },
	} = useRedirectFilters( format );

	const {
		currentPage,
		totalPages,
		visibleItems: visibleRedirects,
		setCurrentPage,
	} = usePagination( sortedRedirects, ITEMS_PER_PAGE );

	const redirectsLength = sortedRedirects?.length;
	const [ selectedRedirect, setSelectedRedirect ] = useState( {} );
	const [ selectedDeleteRedirect, setSelectedDeleteRedirect ] = useState( {} );
	const [ showDeleteModal, setShowDeleteModal ] = useState( false );
	const [ isDeleteLoading, setIsDeleteLoading ] = useState( false );

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

	const renderPagination = () => {
		if ( sortedRedirects.length <= ITEMS_PER_PAGE ) {
			return null;
		}

		const from = ( currentPage - 1 ) * ITEMS_PER_PAGE + 1;
		const to = Math.min( currentPage * ITEMS_PER_PAGE, sortedRedirects.length );

		return (
			<div className="yst-flex yst-justify-end yst-mt-8">
				<div className="yst-flex yst-items-center yst-gap-6">
					<span className="yst-text-gray-600">
						{ sprintf(
							/* translators: 1: From item, 2: To item, 3: Total count */
							__( "Showing %1$d to %2$d of %3$d results", "wordpress-seo" ),
							from,
							to,
							sortedRedirects.length
						) }
					</span>

					<Pagination
						current={ currentPage }
						onNavigate={ setCurrentPage }
						screenReaderTextNext={ __( "Next", "wordpress-seo" ) }
						screenReaderTextPrevious={ __( "Previous", "wordpress-seo" ) }
						total={ totalPages }
					/>
				</div>
			</div>
		);
	};

	if ( isLoading ) {
		return (
			<div className="yst-flex yst-items-center yst-justify-center yst-mt-4">
				<Spinner size="8" />
			</div>
		);
	}

	return (
		<>
			{ redirectsLength > 0 && <div className="yst-text-slate-500 yst-mt-4 yst-py-2 yst-px-2">{ label }</div> }
			<Formik
				initialValues={ {
					target: selectedRedirect.target,
					origin: selectedRedirect.origin,
					type: selectedRedirect.type,
					newTarget: selectedRedirect.target,
					newType: selectedRedirect.type,
					newOrigin: selectedRedirect.origin,
					format } }
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
						redirects={ visibleRedirects }
					/>
					{ renderPagination() }
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
