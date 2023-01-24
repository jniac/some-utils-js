import { FloatVariable } from '../../js/variables/FloatVariable.js'

const size = 32

const variable = new FloatVariable(0, { size, derivativeCount: 1 })

for (let i = 0; i < size; i++) {
  const x = (i + 1) / size
  variable.setNewValue(x * x)
}

document.body.innerHTML = variable.toSvgString()
