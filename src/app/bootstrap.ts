import { Moneda } from '../model/moneda'
import { Tag } from '../model/tag'
import { Gasto } from '../model/gasto'
import { Tarjeta } from '../model/tarjeta'

export class Bootstrap {
    peso: Moneda = new Moneda({ nombre: 'peso' })
    dolar: Moneda = new Moneda({ nombre: 'dolar', cotizacion: 57 })

    chino: Tag = new Tag({ nombre: 'chino' })
    sube: Tag = new Tag({ nombre: 'sube' })
    visa: Tarjeta = new Tarjeta({ nombre: 'visa', dia_regla_cierre_resumen: 4, semana_regla_cierre_resumen: 2 })

    picada: Gasto = new Gasto({
        producto: 'picada',
        monto_total: 400,
        moneda: this.peso,
        tags: [this.chino],
        fecha: new Date('7 July 2019'),
        tarjeta: this.visa,
    })
    weird: Gasto = new Gasto({
        producto: 'raro',
        monto_total: 765,
        moneda: this.dolar,
        tags: [this.chino, this.sube],
        fecha: new Date('27 July 2019'),
        tarjeta: this.visa,
    })

    async run() {
        await Moneda.save([this.peso, this.dolar])
        Gasto.save([this.picada, this.weird])
        await Tarjeta.save(this.visa)
    }
}
