export function Header() {
  return (
    <box justifyContent="center" alignItems="center">
      <box flexDirection="row" justifyContent="center" gap={0.5} alignItems="center">
        <ascii-font font="tiny" color={'gray'} text="agent"/>
        <ascii-font font="tiny" text="Code" color={'cyan'}/>
      </box>
    </box>
  )
}
