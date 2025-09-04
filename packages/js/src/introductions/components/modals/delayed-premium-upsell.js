
import { Modal } from "../modal";

/**
 * @returns {JSX.Element} The element.
 */
const DelayedPremiumUpsellContent = () => {
	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-ai-insights-icon" />
						WIP
					</span>
				</div>
			</div>
		</>
	);
};

/**
 * @returns {JSX.Element} The element.
 */
export const DelayedPremiumUpsell = () => {
	return (
		<Modal>
			<DelayedPremiumUpsellContent />
		</Modal>
	);
};
