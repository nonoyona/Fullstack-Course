import { useState } from "react";

const Form = ({ onPersonAdded }) => {
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");

	const handleNameChange = (event) => {
		console.log("Name changed to: ", event.target.value);
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		console.log("Number changed to: ", event.target.value);
		setNewNumber(event.target.value);
	};

	const handleAddPerson = (event) => {
		event.preventDefault();
		console.log("Adding new person: ", newName);
		let person = { name: newName, number: newNumber };
		setNewNumber("");
		setNewName("");
		onPersonAdded(person);
	};

	return (
		<form onSubmit={handleAddPerson}>
			<div>
				name: <input value={newName} onChange={handleNameChange} />
			</div>
			<div>
				number: <input value={newNumber} onChange={handleNumberChange} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

export default Form;