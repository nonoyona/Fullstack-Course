import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

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

const PersonList = ({ persons }) => {
	if (persons.length === 0) {
		return <div>No persons to show</div>;
	}

	return (
		<div>
			{persons.map((person) => (
				<Person key={person.number} name={person.name} number={person.number} />
			))}
		</div>
	);
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filter, setFilter] = useState("");

	const fetchData = () => {
		console.log("Fetching data from server");
		axios.get("http://localhost:3001/persons").then((response) => {
			console.log("Data fetched", response);
      let newPersons = [...persons];
			for (let person of response.data) {
				if (persons.find((p) => p.number === person.number)) {
					console.log("Person already in phonebook", person);
					continue;
				} else {
					console.log("Adding person to phonebook", person);
				}
				newPersons.push(person);
			}
      setPersons(newPersons);
		});
	};

	useEffect(fetchData, []);

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
			<PersonList persons={personsToShow} />
		</div>
	);
};

export default App;
