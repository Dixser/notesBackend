export function PersonForm({
  addPhone,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) {
  return (
    <form onSubmit={addPhone}>
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
  )
}
