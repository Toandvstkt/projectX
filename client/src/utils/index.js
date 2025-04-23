
export const extractOptions = (input) => {
	const options = input.split(/[A-Z]\.\s+/).filter((option) => option !== '');
	return options;
};
