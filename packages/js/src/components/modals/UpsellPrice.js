import PropTypes from "prop-types";

/**
 * The UpsellPrice component.
 *
 * @param {string} newPrice The component props.
 *
 * @returns {JSX.Element} The UpsellPrice component.
 */
const UpsellPrice = ( { newPrice } ) => {
	const defaultPrice = "99";

	const price = newPrice ? newPrice : defaultPrice;
	return (
		<div className="yst-text-slate-600 yst-my-4">
			{ newPrice && <span className="yst-text-slate-500 yst-line-through">{ defaultPrice }</span> }
			{ " " }
			<span className="yst-text-slate-900 yst-text-2xl yst-font-bold">{ price }</span> / $ USD / € EUR / £ GBP per year (ex. VAT)
		</div>
	);
};

UpsellPrice.propTypes = {
	newPrice: PropTypes.string,
};

export default UpsellPrice;
