import { checkboxSpacerWidth } from '~/components/organisms/Node'
import { height, width } from '~/components/atoms/Checkbox'

type MCheckbox = {
  checked: boolean
  hidden: boolean

  getWidth(): number

  getHeight(): number
}

export const newCheckbox = (): MCheckbox => {
  return {
    ...checkboxImpl,
  }
}

export const checkboxImpl: MCheckbox = Object.freeze({
  checked: false,
  hidden: true,

  getWidth(): number {
    return this.hidden ? 0 : width + checkboxSpacerWidth
  },

  getHeight(): number {
    return height
  },
})

export default MCheckbox
