import { Tag } from '../model/tag'

export function formatearFecha(fecha: Date) {
  return `${fecha.toISOString().slice(0, 10)} 00:00:00`
}

export const toDate = (dateString: any) => {
  var fecha = dateString.split(/\D/)
  return new Date(Number(fecha[0]), Number(fecha[1]) - 1, Number(fecha[2]))
}

export function getAnios(desde: number, hasta: number) {
  const anios: Array<number> = []
  if (desde && hasta) {
    for (desde; desde <= hasta; desde++) {
      anios.push(desde)
    }
  }
  return anios
}

export async function getSelectedTags(ids: Array<number>) {
  const allTags = await Tag.find()
  const selectedTags: Array<Tag> = []
  ids.forEach((currentId) => {
    const foundTag = allTags.find((tag) => tag.id == currentId)
    if (foundTag) {
      selectedTags.push(foundTag)
    }
  })
  return selectedTags
}
