/* eslint-disable react/prop-types */
import { Table, Checkbox, DropdownMenu, SelectField, TextField, Button } from "@yoast/ui-library";
import {  useFormikContext } from "formik";
import FormikWithErrorField from "../../shared-admin/components/form/formik-with-error-field";
import { FormikValueChangeField } from "../../shared-admin/components/form";
import { __ } from "@wordpress/i18n";
import { REDIRECT_TYPE_SHORTS_OPTIONS } from "../constants";
import { useCallback } from "@wordpress/element";

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


	if ( sortedRedirects?.length === 0 ) {
		return (
			<Table.Row>
				<Table.Cell />
				<Table.Cell>{ __( "No items found", "wordpress-seo" ) }</Table.Cell>
				<Table.Cell />
			</Table.Row>
		);
	}

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
									Cancel
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
