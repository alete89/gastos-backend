import { Tarjeta } from "../../src/model/tarjeta"
import { expect } from "chai"
import "mocha"

describe("el cuarto jueves de septiembre 2019", () => {
    const tarjeta = new Tarjeta()
    tarjeta.dia_regla_cierre_resumen = 4 // jueves
    tarjeta.semana_regla_cierre_resumen = 4 // cuarta semana
    it("debe ser el 26 de septiembre", () => {
        const result = tarjeta.calcularfechaDeCierre(2019, 8) // septiembre (Enero es 0)
        expect(result.toString()).to.be.equal(new Date("26 September 2019 23:59:59").toString())
    })
})

describe("el primer lunes de febrero 2019", () => {
    const tarjeta = new Tarjeta()
    tarjeta.dia_regla_cierre_resumen = 1 // lunes
    tarjeta.semana_regla_cierre_resumen = 1// primera semana
    it("debe ser el 4 de febrero", () => {
        const result = tarjeta.calcularfechaDeCierre(2019, 1) // febrero (Enero es 0)
        expect(result.toString()).to.equal(new Date("4 February 2019 23:59:59").toString())
    })
})
