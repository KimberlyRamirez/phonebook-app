import { useState, useEffect } from 'react'
import numServices from './services/numbers';
import Notification from './components/Notification';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterSearch, setNewSearch] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    numServices.getAll().then(res => setPersons(res));
  }, [])

  function changeNotification(str) {
    setNotification(str);
    setTimeout(() => setNotification(null), 3000);
  }

  function dupNames(name) {
    return persons.map(obj => obj.name).includes(name);
  }

  let updateContact = (person, newObj, name) => {
  numServices.update(person.id, newObj)
             .then(updatedNum => setPersons(persons.map(obj => {
               return obj.id !== person.id ? obj : newObj;
             })))
             .catch(error => {
              console.log(error.response.data);
              changeNotification(error.response.data);
             });
  }

  let createContact = (persons) => {
    numServices.create({name: newName, number: newNum})
                 .then(res => {
                    setPersons(persons.concat(res));
                    changeNotification(`${newName} has been added`);
                 })
                 .catch(error => {
                   console.log(error.response.data);
                   changeNotification(error.response.data);
                 });
  }

  let addBtnHandler = (event) => {
    event.preventDefault();
    let name = event.target.dataset.name;
    let person = persons.filter(person => person.name === name)[0];

    if (dupNames(newName)) {
      if (window.confirm(`${name} is already in the phonebook. Do you want to update their info?`)) {
        let newObj = {...person, number: newNum}
        updateContact(person, newObj, name);
      }
    } else {
      createContact(persons);
    }
    setNewName('');
    setNewNum('');
  }

  let valueHandler = (event) => {
    setNewName(event.target.value);
  }

  let numberHandler = (event) => {
    setNewNum(event.target.value);
  }

  let filterHandler = (event) => {
    let value = event.target.value.toLowerCase();

    let filteredContacts = persons.filter(person => {
      return person.name.toLowerCase().includes(value);
    });

    if (value === '') {
      setNewSearch([]);
    } else {
      setNewSearch(filteredContacts);
    }
  }

  let deleteHandler = event => {
    event.preventDefault();
    let name = event.target.dataset.name;
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      let id = persons.filter(person => person.name === name)[0].id;
      numServices.deleteContact(id).then(res => console.log(res))
      setPersons(persons.filter(person => person.name !== name));
    }
  }

  let filter;

  if (filterSearch.length <= 0) {
    filter = <Persons contacts={persons} handler={deleteHandler}/>
  } else {
    filter = <Persons contacts={filterSearch} handler={deleteHandler}/>
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Filter handler={filterHandler}/>
      <h2>Add New</h2>
      <PersonForm
        btnHandler={addBtnHandler}
        valueHandler={valueHandler}
        numHandler={numberHandler}
        newName={newName}
        newNum={newNum}
      />
      <h2>Numbers</h2>
      {filter}
    </div>
  )
}

export default App


