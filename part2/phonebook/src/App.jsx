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

const Person = ({ name, number }) => {
	return (
		<div>
			{name} {number}
		</div>
	);
};

const App = () => {
	const [persons, setPersons] = useState([
		{ name: "Arto Hellas", number: "040-123456", id: 1 },
		{ name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
		{ name: "Dan Abramov", number: "12-43-234345", id: 3 },
		{ name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
	]);
	const [filter, setFilter] = useState("");

	const personsToShow =
		filter === ""
			? persons
			: persons.filter((person) =>
					person.name.toLowerCase().includes(filter.toLowerCase())
			  );

	const handleFilterChange = (event) => {
		console.log("Filter changed to: ", event.target.value);
		setFilter(event.target.value);
	};

	const handleAddPerson = (person) => {
		if (persons.find((p) => p.number === person.number)) {
			alert(`${person.number} is already added to phonebook`);
			return;
		}
		setPersons(persons.concat(person));
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<div>Filter shown with</div>
			<input value={filter} onChange={handleFilterChange} />
			<h2>Add a new</h2>
			<Form onPersonAdded={handleAddPerson} />
			<h2>Numbers</h2>
			{personsToShow.map((person) => (
				<Person key={person.number} name={person.name} number={person.number} />
			))}
		</div>
	);
};

export default App;
