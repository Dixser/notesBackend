export function Persons({ persons, action }) {
  return persons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}{" "}
      <button
        type="button"
        onClick={() => {
          action(person.id, person.name)
        }}
      >
        Delete
      </button>
    </p>
  ))
}
