import { Customer } from '../customer'
import { BadRequest, DataInvalid, NotFound } from '../error/errors'
import { Vehicle } from '../vehicle'

// TODO
export const punctuation = {
  A: 1,
  B: 2,
  C: 4,
  D: 8,
  E: 16,
} as const

export function compareLicense(typeVehicle: string, driverLicenseUser: string) {
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

export function verifyCustomer(customer: Customer): void {
  if (!customer) {
    throw new DataInvalid("Usuário Inválido")
  }

  if (customer.hasRent) {
    throw new BadRequest("Usuário já possui um veículo alugado")
  }
}

export function verifyVehicle(vehicle: Vehicle | undefined): void {
  if (!vehicle) {
    throw new DataInvalid("Veículo Inválido")
  }

  if (vehicle.rented) {
    throw new BadRequest("Veiculo está em uso e não poderá ser alugado")
  }
}