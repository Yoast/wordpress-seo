/* eslint-disable camelcase */
import { useCallback, useRef, useState } from "@wordpress/element";
import { useRedirectFilters } from "../hooks";
import { handleEditSubmit } from "../helpers";

const useListRedirects = () => {
	const {
		sortedRedirects,
		sortOrder,
		toggleSortOrder,
		onDelete,
		selectedRedirects,
		status,
		setters: { toggleSelectRedirect, clearSelectedRedirects, setSelectedRedirects },
	} = useRedirectFilters();

	const [ selectedRedirect, setSelectedRedirect ] = useState( null );
	const [ selectedDeleteRedirect, setSelectedDeleteRedirect ] = useState( {} );
	const [ showDeleteModal, setShowDeleteModal ] = useState( false );
	const [ isDeleteLoading, setIsDeleteLoading ] = useState( false );
	const focusElementRef = useRef( null );

	const redirectsLength = sortedRedirects.length;

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

	const handleEditClick = useCallback(
		( redirect ) => {
			setSelectedRedirect( redirect );
		},
		[ setSelectedRedirect ]
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
		if ( result ) {
			setSelectedRedirect( null );
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

	return {
		sortedRedirects,
		sortOrder,
		toggleSortOrder,
		onDelete,
		selectedRedirects,
		status,
		allSelected,
		onSelectAllChange,
		onToggleSelect,
		selectedRedirect,
		setSelectedRedirect,
		handleEditClick,
		onSubmit,
		selectedDeleteRedirect,
		setSelectedDeleteRedirect,
		showDeleteModal,
		handleDeleteModal,
		handleConfirmDelete,
		isDeleteLoading,
		focusElementRef,
		redirectsLength,
		label: `${redirectsLength} Item${redirectsLength > 1 ? "s" : ""}`,
	};
};

export default useListRedirects;
