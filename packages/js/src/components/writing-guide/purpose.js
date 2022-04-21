import { useCallback } from "@wordpress/element";
import { Select, Title } from "@yoast/ui-library";

const Purpose = ( { data, dispatch } ) => {
	const handleChange = useCallback( value => {
		dispatch( {
			type: "setData",
			payload: {
				...data,
				purpose: value,
			},
		} );
	}, [ data, dispatch ] );

	return (
		<div className="yst-space-y-4">
			<Title className="yst-mb-4">What’s the purpose of your text?</Title>
			<p className="yst-text-base">
				What’s your goal? Do you want to inform people, persuade them (for instance sell them your product) or entertain them? Choose the
				purpose that fits your post best and we’ll provide tailored feedback for this purpose.
			</p>
			<Select
				id="purpose"
				name="purpose"
				className="yst-space-y-4"
				value={ data?.purpose }
				onChange={ handleChange }
				options={ [
					{
						value: "inform",
						label: "Inform",
					},
					{
						value: "persuade",
						label: "Persuade",
					},
					{
						value: "entertain",
						label: "Entertain",
					},
				] }
			/>

		</div>
	);
};

export default Purpose;
