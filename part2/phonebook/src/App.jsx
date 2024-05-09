import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    console.log("Name changed to: ", event.target.value)
    setNewName(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()
    console.log("Adding new person: ", newName)
    let person = { name: newName }
    if (persons.find(p => p.name === newName)) {
      console.log(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName }))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAddPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <div key={person.name}>{person.name}</div>)}
    </div>
  )
}

export default App