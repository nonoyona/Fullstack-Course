import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Form from "./components/Form";
import PersonList from "./components/Person";
import book from "./logic/book";
import Notification from "./components/Notification";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filter, setFilter] = useState("");
	const [notification, setNotification] = useState(null);

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

	const showNotification = (message, level) => {
		setNotification({ message, level });
		setTimeout(() => {
			setNotification(null);
		}, 5000);
	};

	const handleFilterChange = (event) => {
		console.log("Filter changed to: ", event.target.value);
		setFilter(event.target.value);
	};

	const handleAddPerson = (person) => {
		if (persons.find((p) => p.name === person.name)) {
			if (
				confirm(
					`${person.name} is already added to phonebook, replace the old number with a new one?`
				)
			) {
				const id = persons.find((p) => p.name === person.name).id;
				book
					.update(id, person)
					.then((responsePerson) => {
						console.log("Person updated", responsePerson);
						setPersons(persons.map((p) => (p.id !== id ? p : responsePerson)));
						showNotification(`Updated ${person.name}`, "success");
					})
					.catch(() => {
						showNotification(
							`Information of ${person.name} has been deleted from the server and cannot be updated`,
							"error"
						);
						setPersons(persons.filter((p) => p.id !== id));
					});
			}
			return;
		}
		book.create(person).then((responsePerson) => {
			console.log("New person created", responsePerson);
			setPersons(persons.concat(responsePerson));
			showNotification(`Added ${person.name}`, "success");
		});
	};

	const handleDeletePerson = (id) => {
		book
			.remove(id)
			.then(() => {
				console.log("Person deleted");
				setPersons(persons.filter((person) => person.id !== id));
			})
			.catch(() => {
				showNotification(
					`Information of ${
						persons.find((p) => p.id === id).name
					} has already been removed from the server`,
					"error"
				);
				setPersons(persons.filter((person) => person.id !== id));
			});
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification notification={notification} />
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
