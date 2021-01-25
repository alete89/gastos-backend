import { Gasto } from '../../src/model/gasto'
import { Tarjeta } from '../../src/model/tarjeta'
import { expect } from 'chai'
import 'mocha'

describe('tarjeta con cierre el 27 de junio de 2019', () => {
  const tarjeta = new Tarjeta()
  tarjeta.diaCierre = 4 // jueves
  tarjeta.semanaCierre = 4 // cuarta semana

  describe('un gasto de 3 cuotas previo al cierre', () => {

    const gastoPreCierre = new Gasto({
      cuotas: 3,
      fecha: new Date(2019, 5, 15),
      tarjeta: tarjeta,
    })

    it('no aparece en el resumen de junio', () => {
      expect(gastoPreCierre.estaEnResumen(2019, 5)).to.be.false
    })

    it('aparece en el resumen de julio', () => {
      expect(gastoPreCierre.estaEnResumen(2019, 6)).to.be.true
    })

    it('aparece en el resumen de agosto ', () => {
      expect(gastoPreCierre.estaEnResumen(2019, 7)).to.be.true
    })

    it('aparece en el resumen de septiembre', () => {
      expect(gastoPreCierre.estaEnResumen(2019, 8)).to.be.true
    })

    it('no aparece en el resumen de octubre', () => {
      expect(gastoPreCierre.estaEnResumen(2019, 9)).to.be.false
    })

    it('no aparece en el resumen de noviembre', () => {
      expect(gastoPreCierre.estaEnResumen(2019, 10)).to.be.false
    })
  })


  describe('un gasto de 3 cuotas posterior al cierre', () => {

    const gastoPostCierre = new Gasto({
      cuotas: 3,
      fecha: new Date(2019, 5, 28),
      tarjeta: tarjeta,
    })

    it('no aparece en el resumen de junio', () => {
      expect(gastoPostCierre.estaEnResumen(2019, 5)).to.be.false
    })

    it('no aparece en el resumen de julio', () => {
      expect(gastoPostCierre.estaEnResumen(2019, 6)).to.be.false
    })

    it('aparece en el resumen de agosto ', () => {
      expect(gastoPostCierre.estaEnResumen(2019, 7)).to.be.true
    })

    it('aparece en el resumen de septiembre', () => {
      expect(gastoPostCierre.estaEnResumen(2019, 8)).to.be.true
    })

    it('aparece en el resumen de octubre', () => {
      expect(gastoPostCierre.estaEnResumen(2019, 9)).to.be.true
    })

    it('no aparece en el resumen de noviembre', () => {
      expect(gastoPostCierre.estaEnResumen(2019, 10)).to.be.false
    })
  })
})