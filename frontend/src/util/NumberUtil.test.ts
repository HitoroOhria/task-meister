import { sum } from '~/util/NumberUtil'

describe('sum', () => {
  test('Sum args', () => {
    expect(sum(-3, -2)).toBe(-5)
    expect(sum(-1, 0)).toBe(-1)
    expect(sum(0, 0)).toBe(0)
    expect(sum(0, 1)).toBe(1)
    expect(sum(1, 2)).toBe(3)

    expect(sum(-2, -3)).toBe(-5)
    expect(sum(0, -1)).toBe(-1)
    expect(sum(1, 0)).toBe(1)
    expect(sum(2, 1)).toBe(3)
  })
})
