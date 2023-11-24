import { NotFound } from '../error/errors'

// TODO
export const punctuation = {
  A: 1,
  B: 2,
  C: 4,
  D: 8,
  E: 16,
} as const

// Função responsável por criar uma 
export function compareLicence(typeVehicle: string, driverLicenseUser: string) {
  if (!typeVehicle) {
    throw new NotFound('Tipo de veiculo inválido')
  }

  const [firstLicence, otherLicence] = driverLicenseUser.split('') // ['A'], ['A', 'B']
  if (!otherLicence) {
    const punctuationDriver = punctuation[firstLicence as keyof object]
    const punctuationVehicle = punctuation[typeVehicle as keyof object]
    const difference = punctuationDriver - punctuationVehicle

    if (firstLicence === driverLicenseUser || difference >= 2) {
      return true
    }

    return false
  }

  return true
}