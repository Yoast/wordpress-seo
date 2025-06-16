/* eslint-disable camelcase */
import { Table, Spinner } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { useRedirectFilters } from "../hooks";
import { useCallback, useState, useRef } from "@wordpress/element";
import { FORMAT_PLAIN  } from "../constants";
import { Form, Formik } from "formik";
import { TableRows } from "./table-rows";
import { handleEditSubmit, updateValidationSchema } from "../helpers";
import { DeleteModal } from "./delete-modal";
import { TableHeader } from "./table-header";

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

	const redirectsLength = sortedRedirects.length;
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

	const allSelected =
		redirectsLength > 0 &&
		sortedRedirects.every( ( { id } ) => selectedRedirects.includes( id ) );

	const onSelectAllChange = useCallback(
		( event ) => {
			if ( event.target.checked ) {
				const allIds = sortedRedirects.map( ( { id } ) => id );
				setSelectedRedirects( allIds );
			} else {
				clearSelectedRedirects();
			}
		},
		[ sortedRedirects, setSelectedRedirects, clearSelectedRedirects ]
	);

	const onToggleSelect = useCallback(
		( event ) => {
			const id = event.target.getAttribute( "data-id" );
			if ( id ) {
				toggleSelectRedirect( id );
			}
		},
		[ toggleSelectRedirect ]
	);

	const handleEditClick = useCallback( ( redirect ) => {
		setSelectedRedirect( redirect );
	}, [ setSelectedRedirect ] );

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
		if ( result ) {
			setSelectedRedirect( {} );
		}
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
			<div className="yst-flex yst-items-center yst-justify-center yst-mt-8">
				<Spinner size="8" />
			</div>
		);
	}

	return (
		<>
			{ redirectsLength > 0 && <div className="yst-text-slate-500 yst-mt-8">{ label }</div> }
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
					<Table className="yst-mt-4" variant="minimal">
						<TableHeader
							allSelected={ allSelected }
							onSelectAllChange={ onSelectAllChange }
							toggleSortOrder={ toggleSortOrder }
							sortOrder={ sortOrder }
						/>

						<Table.Body>
							<TableRows
								sortedRedirects={ sortedRedirects }
								selectedRedirects={ selectedRedirects }
								onToggleSelect={ onToggleSelect }
								handleDeleteModal={ handleDeleteModal }
								selectedRedirect={ selectedRedirect }
								handleEditClick={ handleEditClick }
								setSelectedDeleteRedirect={ setSelectedDeleteRedirect }
							/>
						</Table.Body>
					</Table>
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
