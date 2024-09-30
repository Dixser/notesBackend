export function Filter({ filter, action }) {
  return (
    <div>
      filter shown with <input value={filter} onChange={action} />
    </div>
  )
}
