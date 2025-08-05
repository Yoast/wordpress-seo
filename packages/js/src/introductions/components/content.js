import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { AiBrandInsightsPreLaunch } from "./ai-brand-insights-pre-launch";
import { STORE_NAME_INTRODUCTIONS } from "../constants";
import { Modal } from "./modal";

/**
 * @returns {JSX.Element} The element.
 */
export const Content = () => {
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "ai-brand-insights-pre-launch.png" ), [] );
	const joinWishlistLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/ai-brand-insights-introduction-pre-launch/" ), [] );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	return (
		<Modal>
			<AiBrandInsightsPreLaunch
				buttonLink={ joinWishlistLink }
				thumbnail={ thumbnail }
			/>
		</Modal>
	);
};
