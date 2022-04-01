/* eslint-disable max-statements */

/**
 * Creates category elements.
 *
 * @returns {{category1: HTMLInputElement, category2: HTMLInputElement, category3: HTMLInputElement,
 * category4: HTMLInputElement, category5: HTMLInputElement, allCategories: HTMLDivElement,
 * mostUsedCategories: HTMLDivElement}} The elements created for categories.
 */
const createCategoryElements = () => {
	// Create regular category elements.
	const cat1 = document.createElement( "input" );
	cat1.setAttribute( "type", "checkbox" );
	cat1.setAttribute( "value", "1" );
	const cat1Name = document.createTextNode( "cat1" );

	const parentCat1 = document.createElement( "label" );
	parentCat1.appendChild( cat1 );
	parentCat1.appendChild( cat1Name );

	const cat2 = document.createElement( "input" );
	cat2.setAttribute( "type", "checkbox" );
	cat2.setAttribute( "value", "2" );
	const cat2Name = document.createTextNode( "cat2" );

	const parentCat2 = document.createElement( "label" );
	parentCat2.appendChild( cat2 );
	parentCat2.appendChild( cat2Name );

	const cat3 = document.createElement( "input" );
	cat3.setAttribute( "type", "checkbox" );
	cat3.setAttribute( "value", "3" );
	const cat3Name = document.createTextNode( "cat3" );

	const parentCat3 = document.createElement( "label" );
	parentCat3.appendChild( cat3 );
	parentCat3.appendChild( cat3Name );

	const cat4 = document.createElement( "input" );
	cat4.setAttribute( "type", "checkbox" );
	cat4.setAttribute( "value", "4" );
	const cat4Name = document.createTextNode( "Birds" );

	const parentCat4 = document.createElement( "label" );
	parentCat4.appendChild( cat4 );
	parentCat4.appendChild( cat4Name );

	const cat5 = document.createElement( "input" );
	cat5.setAttribute( "type", "checkbox" );
	cat5.setAttribute( "value", "5" );
	const cat5Name = document.createTextNode( "dogs" );

	const parentCat5 = document.createElement( "label" );
	parentCat5.appendChild( cat5 );
	parentCat5.appendChild( cat5Name );

	const allCats = document.createElement( "div" );
	allCats.setAttribute( "id", "categorychecklist" );
	allCats.appendChild( parentCat1 );
	allCats.appendChild( parentCat2 );
	allCats.appendChild( parentCat3 );
	allCats.appendChild( parentCat4 );
	allCats.appendChild( parentCat5 );

	const mostUsedCats = document.createElement( "div" );
	mostUsedCats.setAttribute( "id", "categorychecklist-pop" );
	mostUsedCats.appendChild( cat1.cloneNode() );
	mostUsedCats.appendChild( cat2.cloneNode() );

	return {
		category1: cat1,
		category2: cat2,
		category3: cat3,
		category4: cat4,
		category5: cat5,
		allCategories: allCats,
		mostUsedCategories: mostUsedCats,
	};
};

/**
 * Creates tag elements.
 *
 * @returns {{parentTagElement: HTMLDivElement}} The element created for tags.
 */
const createTagElements = () => {
	// Create regular tag elements.
	const tag1 = document.createElement( "li" );
	const tag1ChildNode1 = document.createElement( "button" );
	const tag1ChildNode2 = document.createTextNode( "" );
	const tag1ChildNode3 = document.createTextNode( "cat food" );

	tag1.appendChild( tag1ChildNode1 );
	tag1.appendChild( tag1ChildNode2 );
	tag1.appendChild( tag1ChildNode3 );

	const tag2 = document.createElement( "li" );
	const tag2ChildNode1 = document.createElement( "button" );
	const tag2ChildNode2 = document.createTextNode( "" );
	const tag2ChildNode3 = document.createTextNode( "cat snack" );

	tag2.appendChild( tag2ChildNode1 );
	tag2.appendChild( tag2ChildNode2 );
	tag2.appendChild( tag2ChildNode3 );

	const tagsListElement = document.createElement( "ul" );
	tagsListElement.setAttribute( "class", "tagchecklist" );
	tagsListElement.appendChild( tag1 );
	tagsListElement.appendChild( tag2 );

	const parentTagElement = document.createElement( "div" );
	parentTagElement.setAttribute( "id", "post_tag" );
	parentTagElement.appendChild( tagsListElement );

	return {
		parentTagElement: parentTagElement,
	};
};

/**
 * Creates custom taxonomy elements, both hierarchical and non-hierarchical.
 *
 * @returns {{actor1: HTMLInputElement, actor2: HTMLInputElement, actor3: HTMLInputElement,
 * mostUsedActors: HTMLDivElement, nonHierarchicalParentElement: HTMLDivElement, allActors: HTMLDivElement}} The created custom taxonomy elements.
 */
const createCustomTaxonomyElements = () => {
	// Set to the document the hierarchical custom taxonomy elements.
	const actor1 = document.createElement( "input" );
	actor1.setAttribute( "type", "checkbox" );
	actor1.setAttribute( "value", "1" );
	const actor1Name = document.createTextNode( "actor1" );

	const parentActor1 = document.createElement( "label" );
	parentActor1.appendChild( actor1 );
	parentActor1.appendChild( actor1Name );

	const actor2 = document.createElement( "input" );
	actor2.setAttribute( "type", "checkbox" );
	actor2.setAttribute( "value", "2" );
	const actor2Name = document.createTextNode( "actor2" );

	const parentActor2 = document.createElement( "label" );
	parentActor2.appendChild( actor2 );
	parentActor2.appendChild( actor2Name );

	const actor3 = document.createElement( "input" );
	actor3.setAttribute( "type", "checkbox" );
	actor3.setAttribute( "value", "3" );
	const actor3Name = document.createTextNode( "actor3" );

	const parentActor3 = document.createElement( "label" );
	parentActor3.appendChild( actor3 );
	parentActor3.appendChild( actor3Name );

	const allActors = document.createElement( "div" );
	allActors.setAttribute( "id", "actorschecklist" );
	allActors.appendChild( parentActor1 );
	allActors.appendChild( parentActor2 );
	allActors.appendChild( parentActor3 );

	const mostUsedActors = document.createElement( "div" );
	mostUsedActors.setAttribute( "id", "actorschecklist-pop" );
	mostUsedActors.appendChild( actor1.cloneNode() );
	mostUsedActors.appendChild( actor2.cloneNode() );

	// Set to the document the non-hierarchical custom taxonomy elements.
	const director1 = document.createElement( "li" );
	const director1ChildNode1 = document.createElement( "button" );
	const director1ChildNode2 = document.createTextNode( "" );
	const director1ChildNode3 = document.createTextNode( "Steven Spielberg" );

	director1.appendChild( director1ChildNode1 );
	director1.appendChild( director1ChildNode2 );
	director1.appendChild( director1ChildNode3 );

	const director2 = document.createElement( "li" );
	const director2ChildNode1 = document.createElement( "button" );
	const director2ChildNode2 = document.createTextNode( "" );
	const director2ChildNode3 = document.createTextNode( "Spike Lee" );

	director2.appendChild( director2ChildNode1 );
	director2.appendChild( director2ChildNode2 );
	director2.appendChild( director2ChildNode3 );

	const nonHierarchicalCTElement = document.createElement( "ul" );
	nonHierarchicalCTElement.setAttribute( "class", "tagchecklist" );

	// Add new elements for the non-hierarchical custom taxonomies.
	nonHierarchicalCTElement.appendChild( director1 );
	nonHierarchicalCTElement.appendChild( director2 );

	// Set the parent element for the non-hierarchical custom taxonomies.
	const nonHierarchicalParentElement = document.createElement( "div" );
	nonHierarchicalParentElement.setAttribute( "id", "directors" );
	nonHierarchicalParentElement.appendChild( nonHierarchicalCTElement );

	return {
		actor1: actor1,
		actor2: actor2,
		actor3: actor3,
		allActors: allActors,
		mostUsedActors: mostUsedActors,
		nonHierarchicalParentElement: nonHierarchicalParentElement,
	};
};

/**
 * Creates the elements for post and term slug.
 *
 * @returns {{fullLengthSlugElement: HTMLSpanElement, postNameElement: HTMLInputElement,
 * slugEditDiv: HTMLDivElement, shortSlugElement: HTMLSpanElement}} The created slug elements
 */
const createSlugElements = () => {
	// Creates post slug elements.
	const fullLengthSlugElement = document.createElement( "span" );
	fullLengthSlugElement.setAttribute( "id", "editable-post-name-full" );

	const fullLengthSlugText = document.createTextNode( "best-cat-food" );
	fullLengthSlugElement.appendChild( fullLengthSlugText );

	const shortSlugElement = document.createElement( "span" );
	shortSlugElement.setAttribute( "id", "editable-post-name" );

	const shortSlugText = document.createTextNode( "best-cat" );
	shortSlugElement.appendChild( shortSlugText );

	const slugEditDiv = document.createElement( "div" );
	slugEditDiv.appendChild( fullLengthSlugElement );
	slugEditDiv.appendChild( shortSlugElement );

	const postNameElement = document.createElement( "input" );
	postNameElement.setAttribute( "id", "post_name" );
	postNameElement.setAttribute( "value", "cat-toys" );

	// Creates term slug elements.
	const termSlugElement = document.createElement( "input" );
	termSlugElement.setAttribute( "id", "slug" );
	termSlugElement.setAttribute( "value", "cat-adoption" );

	return {
		fullLengthSlugElement: fullLengthSlugElement,
		shortSlugElement: shortSlugElement,
		slugEditDiv: slugEditDiv,
		postNameElement: postNameElement,
		termSlugElement: termSlugElement,
	};
};

export {
	createCategoryElements,
	createTagElements,
	createCustomTaxonomyElements,
	createSlugElements,
};
