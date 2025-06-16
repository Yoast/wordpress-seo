import { Table, Checkbox, DropdownMenu, SelectField, TextField, Button } from "@yoast/ui-library";
import {  useFormikContext } from "formik";
import FormikWithErrorField from "../../shared-admin/components/form/formik-with-error-field";
import { FormikValueChangeField } from "../../shared-admin/components/form";
import { __ } from "@wordpress/i18n";
import { REDIRECT_TYPE_SHORTS_OPTIONS } from "../constants";
import { useCallback } from "@wordpress/element";

/**
 * TableRows — renders each row of the redirects table, including editable rows.
 *
 * This component displays a list of redirect entries with the ability to:
 * - Select individual redirects via checkboxes
 * - Edit a redirect inline using Formik fields
 * - Trigger a dropdown menu for "Edit" and "Delete" actions
 *
 * @param {Array<Object>} sortedRedirects - List of redirect entries to display.
 * @param {Array<string>} selectedRedirects - Array of selected redirect IDs.
 * @param {Function} onToggleSelect - Handler for checkbox selection toggle.
 * @param {Function} handleDeleteModal - Function to toggle the delete confirmation modal.
 * @param {Object} selectedRedirect - Redirect currently being edited.
 * @param {Function} handleEditClick - Handler to activate edit mode or cancel edit.
 * @param {Function} setSelectedDeleteRedirect - Sets the redirect to delete (used in modal).
 *
 * @returns {JSX.Element} Table rows for each redirect, including editable and action-enabled rows.
*/
export const TableRows =   (
	{
		sortedRedirects,
		selectedRedirects,
		onToggleSelect,
		handleDeleteModal,
		selectedRedirect,
		handleEditClick,
		setSelectedDeleteRedirect,
	}
) => {
	const { isSubmitting } = useFormikContext();

	const editClickHandler = useCallback(
		( type, target, origin ) => () => {
			handleEditClick( { type, target, origin } );
		},
		[ handleEditClick ]
	);

	const onDelete = useCallback( ( values ) => () => {
		setSelectedDeleteRedirect( values );
		handleDeleteModal();
	}, [ handleDeleteModal, setSelectedDeleteRedirect ] );

	return sortedRedirects?.map( ( { id, type, target, origin } ) => {
		const isEditing = selectedRedirect.origin === origin;

		if ( isEditing ) {
			return (
				<Table.Row key={ id } className="yst-cell-edit-redirect">
					<Table.Cell>
						<div className="yst-flex yst-items-center">
							<Checkbox
								checked={ selectedRedirects.includes( id ) }
								onChange={ onToggleSelect }
								aria-label={ __( "Select redirects", "wordpress-seo" ) }
								data-id={ id }
							/>
							<FormikValueChangeField
								as={ SelectField }
								type="select"
								name="newType"
								id="yst-input-type"
								options={ REDIRECT_TYPE_SHORTS_OPTIONS }
								className="yst-min-w-[83px]"
							/>
						</div>
					</Table.Cell>
					<Table.Cell>
						<FormikWithErrorField
							as={ TextField }
							type="text"
							name="newOrigin"
							id="yst-input-origin"
						/>
					</Table.Cell>
					<Table.Cell>
						<div className="yst-flex yst-items-end yst-gap-2.5">
							<FormikWithErrorField
								as={ TextField }
								type="text"
								name="newTarget"
								id="yst-input-target"
								className="yst-w-full"
							/>
							<div className="yst-flex px-2 py-2.5 yst-gap-2.5 yst-mb-0.5">
								<Button
									id="yst-button-submit-edit-redirect"
									type="submit"
									isLoading={ isSubmitting }
									disabled={ isSubmitting }
								>
									{ __( "Save", "wordpress-seo" ) }
								</Button>
								<Button
									variant="secondary"
									onClick={ handleEditClick }
								>
									{ __( "Cancel", "wordpress-seo" ) }
								</Button>
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			);
		}

		return (
			<Table.Row key={ id }>
				<Table.Cell>
					<div className="yst-flex yst-items-center">
						<Checkbox
							checked={ selectedRedirects.includes( id ) }
							onChange={ onToggleSelect }
							aria-label={ __( "Select redirects", "wordpress-seo" ) }
							data-id={ id }
						/>
						<span className="yst-text-slate-800 yst-font-medium">{ type }</span>
					</div>
				</Table.Cell>
				<Table.Cell>/{ origin }</Table.Cell>
				<Table.Cell>
					<div className="yst-flex yst-justify-between yst-items-end yst-relative">
						<div>{ target }</div>
						<DropdownMenu as="span">
							<DropdownMenu.IconTrigger
								screenReaderTriggerLabel={ __( "Open menu", "wordpress-seo" ) }
								className="yst-float-end"
							/>
							<DropdownMenu.List className="yst-absolute yst-mt-8 yst-right-0 yst-w-44 yst-z-10">
								<DropdownMenu.ButtonItem
									onClick={ editClickHandler( type, target, origin ) }
								>
									{ __( "Edit", "wordpress-seo" ) }
								</DropdownMenu.ButtonItem>
								<DropdownMenu.ButtonItem
									onClick={ onDelete( { type, target, origin } ) }
								>
									{ __( "Delete", "wordpress-seo" ) }
								</DropdownMenu.ButtonItem>
							</DropdownMenu.List>
						</DropdownMenu>
					</div>
				</Table.Cell>
			</Table.Row>
		);
	} );
};
