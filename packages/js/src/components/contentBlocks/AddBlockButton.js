import { PlusIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * AddBlockButton component to render the add block button.
 *
 * @param {Object} props Component props.
 * @param {Function} props.onClick Function to call when the button is clicked.
 * @returns {JSX.Element} The AddBlockButton component.
 */
export const AddBlockButton = ( { onClick } ) => {
	return (
		<button
			className="yst-box-border yst-flex yst-flex-row yst-justify-center yst-items-center yst-p-1.5 yst-gap-1.5 yst-w-7 yst-h-7 yst-bg-white yst-border yst-border-slate-300 yst-shadow-sm yst-rounded-md"
			aria-label={ __( "Add block", "wordpress-seo" ) }
			onClick={ onClick }
		>
			<PlusIcon className="yst-h-4 yst-w-4" />
		</button>
	);
};

AddBlockButton.propTypes = {
	onClick: PropTypes.func.isRequired,
};
