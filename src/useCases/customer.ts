import { UUID, randomUUID } from 'crypto'
import { AlreadyRegistered, NotFound } from './error/errors'
import { Vehicle } from './vehicle'

export enum ECategoryType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  AB = 'AB',
  AC = 'AC',
  AD = 'AD',
  AE = 'AE',
}

export class Customer {
  
  private _id: UUID
  private _cpf: string
  private _name: string
  private _driverLicense: ECategoryType
  private _hasRent = false
  
  private static customers: Customer[] = []

  constructor(
    cpf: string,
    name: string,
    driverLicense: ECategoryType,
  ) {
    this._id = randomUUID()
    this._cpf = cpf
    this._name = name
    this._driverLicense = driverLicense
  }

  get id(): UUID {
    return this._id
  }

  get cpf(): string {
    return this._cpf
  }

  get name(): string {
    return this._name
  }

  get driverLicense(): string {
    return this._driverLicense
  }

  get hasRent(): boolean {
    return this._hasRent
  }

  set hasRent(newRent: boolean) {
    this._hasRent = newRent
  }

  static create(customer: Customer): void {
    const alreadyExistsCustomer = this.customers.find(
      (customer) => customer._id === customer._cpf,
    )

    if (alreadyExistsCustomer) {
      throw new AlreadyRegistered()
    }

    Customer.customers.push(customer)
  }

  static getById(customerId: string): Customer {
    const customer = this.customers.find(
      (customer) => customer._id === customerId,
    )

    if (!customer) {
      throw new NotFound()
    }

    return customer
  }

  static getAll(): Customer[] {
    return Customer.customers
  }

  static delete(customerId: string): boolean {
    const customerIndex = this.customers.findIndex(
      (customer) => customer._id === customerId,
    )

    if (customerIndex === -1) {
      throw new NotFound()
    }

    this.customers.splice(customerIndex, 1)
    return true
  }
}
