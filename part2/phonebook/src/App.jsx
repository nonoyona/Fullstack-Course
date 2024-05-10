import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Form from "./components/Form";
import PersonList from "./components/Person";
import book from "./logic/book";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filter, setFilter] = useState("");

	const fetchData = () => {
		console.log("Fetching data from server");
		book
			.getAll()
			.then((responsePersons) => {
				let newPersons = [...persons];
				for (let person of responsePersons) {
					if (persons.find((p) => p.number === person.number)) {
						console.log("Person already in phonebook", person);
						continue;
					} else {
						console.log("Adding person to phonebook", person);
					}
					newPersons.push(person);
				}
				setPersons(newPersons);
			})
			.catch((error) => {
				console.log("Error fetching data", error);
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
		book.create(person).then((responsePerson) => {
			console.log("New person created", responsePerson);
			setPersons(persons.concat(responsePerson));
		});
	};

	const handleDeletePerson = (id) => {
		book.remove(id).then(() => {
			console.log("Person deleted");
			setPersons(persons.filter((person) => person.id !== id));
		});
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<div>Filter shown with</div>
			<input value={filter} onChange={handleFilterChange} />
			<h2>Add a new</h2>
			<Form onPersonAdded={handleAddPerson} />
			<h2>Numbers</h2>
			<PersonList persons={personsToShow} onDelete={handleDeletePerson} />
		</div>
	);
};

export default App;
