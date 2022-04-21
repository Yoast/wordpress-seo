/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { useCallback } from "@wordpress/element";
import { Title, Select } from "@yoast/ui-library";

const Schema = ( { data, dispatch } ) => {
	const handleChange = useCallback( event => {
		dispatch( {
			type: "setData",
			payload: {
				...data,
				[ event.target.name ]: event.target.value,
			},
		} );
	}, [ data, dispatch ] );

	return (
		<div>
			<Title className="yst-mb-4">What type of post or page is it?</Title>
			<p className="yst-mb-4">
				If you tell us which type of page you want to create, we can help you with a specific layout, provide tailored content feedback and tell Google what kind of page it is.
			</p>
			<Select
				name="articleType"
				value={ data?.articleType }
				onChange={ handleChange }
				options={ [
					{
						value: "Blog post",
						label: "Blog post",
					},
					{
						value: "Product page",
						label: "Product page",
					},
					{
						value: "How to",
						label: "How to",
					},
					{
						value: "FAQ",
						label: "FAQ",
					},
					{
						value: "News article",
						label: "News article",
					},
					{
						value: "Job posting",
						label: "Job posting",
					},
					{
						value: "Contact page",
						label: "Contact page",
					},
					{
						value: "Scholarly article",
						label: "Scholarly article",
					},
					{
						value: "Other",
						label: "Other",
					},
				] }
			/>
		</div>
	);
};

export default Schema;
