import { Gasto } from '../model/gasto'
import { Moneda } from '../model/moneda'
import { Tag } from '../model/tag'
import { Tarjeta } from '../model/tarjeta'
import { User } from '../model/user'

export class Bootstrap {
  alete: User = new User({ email: 'dsa', password: '$2a$12$9o0q///jxKJMcSO3cbo9ZeA8afWNFj2L2wdN7bPm9MqJkR1o907hC' })
  asd: User = new User({ email: 'asd', password: '$2a$12$CFtzWKadJM/.nYB5hrqthOElLE8S1tPjX/d5QogukAcdmuhX2Oyvy' })

  peso: Moneda = new Moneda({ nombre: 'peso' })
  dolar: Moneda = new Moneda({ nombre: 'dolar', cotizacion: 57 })

  chino: Tag = new Tag({ nombre: 'chino' })
  sube: Tag = new Tag({ nombre: 'sube' })
  visa: Tarjeta = new Tarjeta({
    nombre: 'visa',
    dia_regla_cierre_resumen: 4,
    semana_regla_cierre_resumen: 2,
    user: this.alete,
  })
  master: Tarjeta = new Tarjeta({
    nombre: 'master',
    dia_regla_cierre_resumen: 3,
    semana_regla_cierre_resumen: 1,
    user: this.alete,
  })
  american: Tarjeta = new Tarjeta({
    nombre: 'american',
    dia_regla_cierre_resumen: 3,
    semana_regla_cierre_resumen: 1,
    user: this.asd,
  })

  picada: Gasto
  weird: Gasto

  async run() {
    try {
      await User.save(this.alete)
      await User.save(this.asd)
      await Moneda.save([this.peso, this.dolar])
      await Tarjeta.save(this.visa)
      await Tarjeta.save(this.master)
      await Tarjeta.save(this.american)
      this.picada = new Gasto({
        producto: 'picada',
        monto_total: 400,
        moneda: this.peso,
        tags: [this.chino],
        fecha: new Date('7 July 2020'),
        tarjeta: this.visa,
        comentario: 'rica picada',
      })
      this.weird = new Gasto({
        producto: 'raro',
        monto_total: 1231,
        cuotas: 10,
        moneda: this.dolar,
        tags: [this.chino, this.sube],
        fecha: new Date('27 October 2020'),
        tarjeta: this.visa,
        comentario: 'gasto raro',
      })
      await Gasto.save([this.picada, this.weird])
    } catch (error) {
      console.log(error)
    }
  }
}
