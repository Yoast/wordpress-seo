import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * The FieldArray component.
 *
 * @param {Array} items The array containing the organization's social profiles.
 * @param {Function} onAddProfile Function to call when a new field is added to the field array.
 * @param {Function} onRemoveProfile Function to call when a field is removed from the field array.
 * @param {Function} onChangeProfile Function to call when the content of a field is edited.
 * @param {Array} [errorFields=[]] The array containing the names of the fields with an invalid value.
 * @param {React.ElementType} fieldType The component to render each item with.
 * @param {React.ReactNode} [addButtonChildren] Children for the add item button.
 *
 * @returns {JSX.Element} The FieldArray component.
 */
const SocialFieldArray = ( {
	items,
	onAddProfile,
	onRemoveProfile,
	onChangeProfile,
	errorFields = [],
	fieldType: Component,
	addButtonChildren = __( "Add another profile", "wordpress-seo" ),
} ) => {
	const handleRemove = useCallback( ( event ) => {
		onRemoveProfile( parseInt( event.currentTarget.dataset.index, 10 ) );
	}, [ onRemoveProfile ] );

	return (
		<div>
			{ items.map( ( item, index ) => (
				<div key={ `url-${ index }` }>
					<div className="yst-w-full yst-flex yst-items-start yst-mt-4">
						<Component
							className="yst-grow"
							label={ __( "Other social profile", "wordpress-seo" ) }
							id={ `social-input-other-url-${ index }` }
							value={ item }
							socialMedium="other"
							index={ index }
							onChange={ onChangeProfile }
							placeholder={ __( "E.g. https://social-platform.com/yoast", "wordpress-seo" ) }
							feedback={ {
								type: "error",
								isVisible: errorFields.includes( "other_social_urls-" + index ),
								message: [ __( "Could not save this value. Please check the URL.", "wordpress-seo" ) ],
							} }
						/>
						<button
							type="button"
							className="yst-mt-[27.5px] yst-ml-2 yst-p-3 yst-text-slate-500 yst-rounded-md hover:yst-text-primary-500 focus:yst-text-primary-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 yst-no-underline;"
							id={ `remove-profile-${ index }` }
							data-index={ index }
							onClick={ handleRemove }
						>
							<span className="yst-sr-only">
								{
									/* translators: Hidden accessibility text. */
									__( "Delete item", "wordpress-seo" )
								}
							</span>
							<TrashIcon className="yst-w-5 yst-h-5" />
						</button>
					</div>
				</div>
			) ) }
			<Button
				id="add-profile"
				variant="secondary"
				className="yst-items-center yst-mt-8"
				onClick={ onAddProfile }
				data-hiive-event-name="clicked_add_profile"
			>
				<PlusIcon className="yst-w-5 yst-h-5 yst-me-1 yst-text-slate-400" />
				{ addButtonChildren }
			</Button>
		</div>
	);
};

SocialFieldArray.propTypes = {
	fieldType: PropTypes.elementType.isRequired,
	items: PropTypes.array.isRequired,
	onAddProfile: PropTypes.func.isRequired,
	onRemoveProfile: PropTypes.func.isRequired,
	onChangeProfile: PropTypes.func.isRequired,
	errorFields: PropTypes.array,
	addButtonChildren: PropTypes.node,
};
export default SocialFieldArray;
