import { randomUUID } from 'crypto'
import { AlreadyRegistered, NotFound } from './error/errors'

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

export interface ICustomer {
  id: string
  cpf: string
  name: string
  driverLicense: string
}

export class Customer {
  private static customers: ICustomer[] = []

  constructor(
    private _cpf: string,
    private _name: string,
    private _driverLicense: ECategoryType,
  ) {}

  get cpf(): string {
    return this._cpf
  }

  get name(): string {
    return this._name
  }

  get driverLicense(): string {
    return this._driverLicense
  }

  static create(customer: Customer): void {
    const alreadyExistsCustomer = this.customers.find(
      (customer) => customer.id === customer.cpf,
    )

    if (alreadyExistsCustomer) {
      throw new AlreadyRegistered()
    }

    const id = randomUUID()
    const newcustomer = {
      id,
      cpf: customer.cpf,
      name: customer.name,
      driverLicense: customer.driverLicense,
    }

    Customer.customers.push(newcustomer)
  }

  static getById(customerId: string): ICustomer {
    const customer = this.customers.find(
      (customer) => customer.id === customerId,
    )

    if (!customer) {
      throw new NotFound()
    }

    return customer as ICustomer
  }

  static getAll(): ICustomer[] {
    return Customer.customers as ICustomer[]
  }

  static delete(customerId: string): boolean {
    const customerIndex = this.customers.findIndex(
      (customer) => customer.id === customerId,
    )

    if (customerIndex === -1) {
      throw new NotFound()
    }

    this.customers.splice(customerIndex, 1)
    return true
  }

  // TO-DO
  static rentVehicle(): boolean {
    return true
  }

  // TO-DO
  static returnVehicle(): boolean {
    return true
  }
}
