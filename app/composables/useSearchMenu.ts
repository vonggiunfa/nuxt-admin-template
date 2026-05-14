export function useSearchMenu() {
  const open = useState('command-menu-open', () => false)

  function setOpen(value: boolean) {
    open.value = value
  }

  function toggle() {
    open.value = !open.value
  }

  return { open, setOpen, toggle }
}
