import { __ } from "@wordpress/i18n";

/**
 * Banner for the modal.
 *
 * @returns {wp.Element} The ModalBanner component.
 */
const ModalBanner = () => {
	return (
		<div className="yst-flex yst-justify-between yst-leading-[33px] yst-text-lg yst-content-between yst-bg-black yst-text-amber-300 yst-h-9 yst-border-amber-300 yst-border-y yst-border-x-0 yst-border-solid yst-px-6">
			<div>{ __( "BLACK FRIDAY", "wordpress-seo" ) }</div>
			<div>{ __( "30% OFF", "wordpress-seo" ) }</div>
		</div>
	);
};

export default ModalBanner;
