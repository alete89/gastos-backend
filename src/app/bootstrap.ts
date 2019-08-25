import { Moneda } from "../model/moneda"
import { Tag } from "../model/tag"
import { Gasto } from "../model/gasto"

export class Bootstrap {
    peso: Moneda = new Moneda({ nombre: "peso" })
    dolar: Moneda = new Moneda({ nombre: "dolar", cotizacion: 57 })

    chino: Tag = new Tag({ nombre: "chino" })
    sube: Tag = new Tag({ nombre: "sube" })

    picada: Gasto = new Gasto({ producto: "picada", monto_total: 400, moneda: this.peso, tags: [this.chino] })
    weird: Gasto = new Gasto({ producto: "raro", monto_total: 765, moneda: this.dolar, tags: [this.chino, this.sube] })

    async run() {
        Moneda.save([this.peso, this.dolar])
        Tag.save([this.chino, this.sube])
        Gasto.save([this.picada, this.weird])
    }
}
