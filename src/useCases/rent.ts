import { differenceInDays, parseISO } from 'date-fns'
import { Customer } from './customer'
import { DataInvalid, DifferenceBetweenDate, NotFound } from './error/errors'
import {
    compareLicense,
    verifyCustomer,
    verifyVehicle,
} from './utils/rentValidation'
import { Vehicle } from './vehicle'

const IVehicle = {
  CAR: 'B',
  MOTORCYCLE: 'A',
}

interface IInvoice {
  customerName: string
  customerCpf: string
  customerCnh: string
  vehiclePlate: string
  vehicleType: string
  vehicleModel: string
  vehicleRental: number
  rentalDate: Date
  devolutionDate: Date
  valueRental: number
}
export class Rent {
  private _customer: Customer
  private _vehicle: Vehicle
  private _rentalDate: Date
  private _devolutionDate: Date
  private _valueRental: number

  private static listOfRent: Rent[] = []

  constructor(
    customer: Customer,
    vehicle: Vehicle,
    rentalDate: Date,
    devolutionDate: Date
  ) {
    this._customer = customer
    this._vehicle = vehicle
    this._rentalDate = rentalDate
    this._devolutionDate = devolutionDate
    this._valueRental = 0
  }

  get customer(): Customer {
    return this._customer
  }

  set customer(newCustomer: Customer) {
    this._customer = newCustomer
  }

  get vehicle(): Vehicle {
    return this._vehicle
  }

  set vehicle(newVehicle: Vehicle) {
    this._vehicle = newVehicle
  }

  get rentalDate(): Date {
    return this._rentalDate
  }

  set rentalDate(newRentalDate: Date) {
    this._rentalDate = newRentalDate
  }

  get devolutionDate(): Date {
    return this._devolutionDate
  }

  set devolutionDate(newDevolutionDate: Date) {
    this._devolutionDate = newDevolutionDate
  }

  get valueRental(): number {
    return this._valueRental
  }

  set valueRental(newValueRental: number) {
    this._valueRental = newValueRental
  }

  static calculateRent(
    vehicle: Vehicle,
    days: number,
    increasePorcentage: number
  ): number {
    const valueBase = days * vehicle.dailyRental
    const valueIncrease = valueBase * (increasePorcentage / 100)
    return valueBase + valueIncrease
  }

  static rentVehicle(
    customerCpf: string,
    vehiclePlate: string,
    rentalDate: Date,
    devolutionDate: Date
  ): Rent {
    const customer = Customer.getByCpf(customerCpf)
    verifyCustomer(customer)

    const vehicle = Vehicle.getByPlate(vehiclePlate)
    verifyVehicle(vehicle)
    const driverLicenseUser = customer.driverLicense
    const typeVehicle = IVehicle[vehicle.type]
    const verifyLicense = compareLicense(typeVehicle, driverLicenseUser)

    if (!verifyLicense) {
      throw new DataInvalid()
    }

    const devolution = parseISO(String(devolutionDate))
    const rental = parseISO(String(rentalDate))

    const dateRented = differenceInDays(devolution, rental) + 1 // TO-DO VERIFICAR O +1

    if (dateRented < 0) {
      throw new DifferenceBetweenDate(
        'Data da devolução deve ser maior ou igual que a de solicitação'
      )
    }

    const increasePorcentage = vehicle.type === 'CAR' ? 10 : 5
    const valueRental = this.calculateRent(
      vehicle,
      dateRented,
      increasePorcentage
    )

    const rent = new Rent(customer, vehicle, rentalDate, devolutionDate)
    rent.valueRental = valueRental
    Rent.listOfRent.push(rent)

    vehicle.rented = true

    return rent
  }

  static devolutionVehicle(cpf: string, plate: string): boolean {
    const customer = Customer.getByCpf(cpf)
    verifyCustomer(customer)

    const vehicle = Vehicle.getByPlate(plate)
    if (!vehicle) {
      throw new DataInvalid('Veículo Inválido')
    }

    const rent = Rent.listOfRent.find(
      (r) => r.customer.cpf === cpf && r.vehicle.plate === plate
    )

    if (!rent) {
      throw new NotFound('Aluguel não encontrado')
    }

    const indexRent = Rent.listOfRent.findIndex(
      (r) => r.customer.cpf === cpf && r.vehicle.plate === plate
    )
    Rent.listOfRent.splice(indexRent, 1)


    rent.vehicle.rented = false
    rent.customer.hasRent = false

    return true
  }

  static generateInvoice(cpf: string, plate: string): IInvoice {
    const rent = Rent.listOfRent.find(
      (r) => r.customer.cpf === cpf && r.vehicle.plate === plate
    )

    if (!rent) {
      throw new NotFound('Aluguel não encontrado')
    }

    return {
      customerName: rent.customer.name,
      customerCpf: rent.customer.cpf,
      customerCnh: rent.customer.driverLicense,
      vehiclePlate: rent.vehicle.plate,
      vehicleType: rent.vehicle.type,
      vehicleModel: rent.vehicle.model,
      vehicleRental: rent.vehicle.dailyRental,
      rentalDate: rent.rentalDate,
      devolutionDate: rent.devolutionDate,
      valueRental: rent.valueRental,
    }
  }
}
