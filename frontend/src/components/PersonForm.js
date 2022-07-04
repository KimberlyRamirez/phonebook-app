const PersonForm = ({btnHandler, valueHandler, numHandler, newName, newNum}) => {
  return (
    <>
      <form>
        <div>
          name: <input onChange={valueHandler} value={newName}/>
        </div>
        <div>number: <input onChange={numHandler} value={newNum}/></div>
        <div>
          <button type="submit" onClick={btnHandler} data-name={newName}>add</button>
        </div>
      </form>
    </>
  )
}

export default PersonForm;
