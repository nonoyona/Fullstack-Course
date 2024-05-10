const Person = ({ person, onDelete }) => {

    const handleDelete = () => {
        if (window.confirm(`Delete ${person.name}?`)) {
            onDelete();
        }
    }

	return (
		<div>
			{person.name} {person.number}
			<button onClick={handleDelete}>Delete</button>
		</div>
	);
};

const PersonList = ({ persons, onDelete }) => {
	if (persons.length === 0) {
		return <div>No persons to show</div>;
	}

	return (
		<div>
			{persons.map((person) => (
				<Person
					key={person.id}
					person={person}
					onDelete={() => onDelete(person.id)}
				/>
			))}
		</div>
	);
};

export default PersonList;
