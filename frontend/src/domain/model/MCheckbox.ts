type MCheckbox = {
  checked: boolean
  hidden: boolean
}

export const newCheckbox = (): MCheckbox => {
  return {
    ...checkboxImpl,
  }
}

export const checkboxImpl: MCheckbox = {
  checked: false,
  hidden: true,
}
Object.freeze(checkboxImpl)

export default MCheckbox
