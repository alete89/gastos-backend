import { Tarjeta } from "../../src/model/tarjeta"
import { expect } from "chai"
import "mocha"

describe("el cuarto jueves de septiembre 2019", () => {
    const tarjeta = new Tarjeta()
    tarjeta.dia_regla_cierre_resumen = 3 // jueves
    tarjeta.semana_regla_cierre_resumen = 4 // cuarta semana
    it("debe ser el 26 de septiembre", () => {
        const result = tarjeta.fechaDeCierre(2019, 9) // septiembre
        expect(result).to.be.equal(new Date("2019-09-26"))
    })
})

describe("el primer lunes de febrero 2019", () => {
    const tarjeta = new Tarjeta()
    tarjeta.dia_regla_cierre_resumen = 0 // lunes
    tarjeta.semana_regla_cierre_resumen = 1 // primera semana
    it("debe ser el 4 de febrero", () => {
        const result = tarjeta.fechaDeCierre(2019, 2) // febrero
        expect(result).to.equal(new Date("2019-02-04"))
    })
})
