import { PropTypes } from "prop-types";
import { ToggleField } from "@yoast/ui-library";

/**
 * Modal component.
 *
 * @param {Object}   props                       The props.
 * @param {Object}   props.integration           Contents of the modal.
 * @param {JSX.node} props.children              Contents of the modal.
 *
 * @returns {JSX.Element} The modal element.
 */
export default function Card( { integration, children } ) {
	return (
		<div key={integration.title} className="yst-flex yst-flex-col yst-rounded-lg yst-shadow-lg yst-overflow-hidden yst-mr-3 yst-mb-4">
			<div className="yst-flex-1 yst-bg-white yst-p-6 yst-flex yst-flex-col yst-justify-between">
				<div className="yst-flex-1">
					<p className="yst-text-xl yst-font-semibold yst-text-gray-900">{integration.title}</p>
					<p className="yst-mt-3 yst-text-base yst-text-gray-500">{integration.description}</p>
				</div>
				<div className="yst-flex-1">
					<ToggleField
						checked
						label={ "Enable" + integration.name }
						onChange={function noRefCheck(){}}
					/>
				</div>
			</div>
		</div>
	);
}

Card.propTypes = {
	integration: PropTypes.object.isRequired,
	children: PropTypes.node,
};

Card.defaultProps = {
	integration: { name: "Semrush", description: "An integration" }
};
