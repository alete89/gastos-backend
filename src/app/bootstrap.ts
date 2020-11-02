import { Gasto } from '../model/gasto'
import { Moneda } from '../model/moneda'
import { Tag } from '../model/tag'
import { Tarjeta } from '../model/tarjeta'

export class Bootstrap {
  peso: Moneda = new Moneda({ nombre: 'peso' })
  dolar: Moneda = new Moneda({ nombre: 'dolar', cotizacion: 57 })

  chino: Tag = new Tag({ nombre: 'chino' })
  sube: Tag = new Tag({ nombre: 'sube' })
  visa: Tarjeta = new Tarjeta({ nombre: 'visa', dia_regla_cierre_resumen: 4, semana_regla_cierre_resumen: 2 })
  master: Tarjeta = new Tarjeta({ nombre: 'master', dia_regla_cierre_resumen: 3, semana_regla_cierre_resumen: 1 })

  picada: Gasto
  weird: Gasto

  async run() {
    try {
      await Moneda.save([this.peso, this.dolar])
      await Tarjeta.save(this.visa)
      await Tarjeta.save(this.master)
      this.picada = new Gasto({
        producto: 'picada',
        monto_total: 400,
        moneda: this.peso,
        tags: [this.chino],
        fecha: new Date('7 July 2020'),
        tarjeta: this.visa,
      })
      this.weird = new Gasto({
        producto: 'raro',
        monto_total: 1231,
        cuotas:10,
        moneda: this.dolar,
        tags: [this.chino, this.sube],
        fecha: new Date('27 October 2020'),
        tarjeta: this.visa,
      })
      await Gasto.save([this.picada, this.weird])
    } catch (error) {
      console.log(error)
    }
  }
}
