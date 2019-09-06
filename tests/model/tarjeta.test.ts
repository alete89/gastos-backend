import { Tarjeta } from "../../src/model/tarjeta"
import { expect } from "chai"
import "mocha"

describe("el cuarto jueves de septiembre", () => {
    const tarjeta = new Tarjeta()
    tarjeta.dia_regla_cierre_resumen = 4 // jueves
    tarjeta.semana_regla_cierre_resumen = 3 // cuarta semana
    it("debe ser el fecha 26", () => {
        const result = tarjeta.fechaDeCierre(2019, 9) // septiembre
        expect(result).to.be.equal(new Date("2019-09-26"))
    })
})

describe("el primer lunes de febrero", () => {
    const tarjeta = new Tarjeta()
    tarjeta.dia_regla_cierre_resumen = 1 // lunes
    tarjeta.semana_regla_cierre_resumen = 0 // primera semana
    it("debe ser el fecha 4", () => {
        const result = tarjeta.fechaDeCierre(2019, 2) // febrero
        expect(result).to.equal(new Date("2019-02-04"))
    })
})
