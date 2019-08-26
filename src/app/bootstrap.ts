import { Moneda } from "../model/moneda"
import { Tag } from "../model/tag"
import { Gasto } from "../model/gasto"
import { Tarjeta } from "../model/tarjeta"

export class Bootstrap {
    peso: Moneda = new Moneda({ nombre: "peso" })
    dolar: Moneda = new Moneda({ nombre: "dolar", cotizacion: 57 })

    chino: Tag = new Tag({ nombre: "chino" })
    sube: Tag = new Tag({ nombre: "sube" })

    picada: Gasto = new Gasto({ producto: "picada", monto_total: 400, moneda: this.peso, tags: [this.chino] })
    weird: Gasto = new Gasto({ producto: "raro", monto_total: 765, moneda: this.dolar, tags: [this.chino, this.sube] })

    visa: Tarjeta = new Tarjeta({ nombre: "visa", gastos: [this.picada, this.weird] })

    async run() {
        Moneda.save([this.peso, this.dolar])
        // Gasto.save([this.picada, this.weird])
        Tarjeta.save(this.visa)
    }
}
