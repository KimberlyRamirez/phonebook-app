const Persons = ({contacts, handler}) => {
  return contacts.map(person => {
    return (
      <>
        <p key={person.name}>
          {person.name} {person.number}
          <button className='deleteBtn' onClick={handler} data-name={person.name}>delete</button>
        </p>
      </>
    )
  });
}

export default Persons;
