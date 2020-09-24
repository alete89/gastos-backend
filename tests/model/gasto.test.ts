import { Gasto } from '../../src/model/gasto'
import { Tarjeta } from '../../src/model/tarjeta'
import { expect } from 'chai'
import 'mocha'

describe('un gasto de 3 cuotas en junio', () => {
  const tarjeta = new Tarjeta()
  tarjeta.dia_regla_cierre_resumen = 4 // jueves
  tarjeta.semana_regla_cierre_resumen = 4 // cuarta semana

  const compra = new Gasto({
    cuotas: 3,
    fecha: new Date(2019, 5, 15),
    tarjeta: tarjeta,
  })

  it('no aparece en el resumen de junio', () => {
    expect(compra.estaEnResumen(2019, 5)).to.be.false
  })

  it('aparece en el resumen de julio', () => {
    expect(compra.estaEnResumen(2019, 6)).to.be.true
  })

  it('aparece en el resumen de agosto ', () => {
    expect(compra.estaEnResumen(2019, 7)).to.be.true
  })

  it('aparece en el resumen de septiembre', () => {
    expect(compra.estaEnResumen(2019, 8)).to.be.true
  })

  it('no aparece en el resumen de octubre', () => {
    expect(compra.estaEnResumen(2019, 9)).to.be.false
  })

  it('no aparece en el resumen de noviembre', () => {
    expect(compra.estaEnResumen(2019, 10)).to.be.false
  })
})
