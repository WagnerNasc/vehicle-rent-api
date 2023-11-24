import { UUID, randomUUID } from 'crypto'
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

export class Customer {
  
  private _id: UUID
  private _cpf: string
  private _name: string
  private _dateOfBirth: Date
  private _driverLicense: ECategoryType
  private _hasRent = false
  
  private static customers: Customer[] = []

  constructor(
    cpf: string,
    name: string,
    dateOfBirth: Date,
    driverLicense: ECategoryType,
  ) {
    this._id = randomUUID()
    this._cpf = cpf
    this._name = name
    this._dateOfBirth = dateOfBirth
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

  get dateOfBirth(): Date {
    return this._dateOfBirth
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

  static create(newCustomer: Customer): Customer {
    const alreadyExistsCustomer = this.customers.some(
      customer => customer.cpf === newCustomer.cpf,
    )

    if (alreadyExistsCustomer) {
      throw new AlreadyRegistered('Cliente já registrado')
    }
    
    this.customers.push(newCustomer)
    
    // TO-DO precisei fazer mais uma consulta para pegar o ID e mandar para front!

    const customer = this.customers.find(customer => customer.cpf === newCustomer.cpf)
// 
    return customer as Customer
  }

  static getById(customerId: string): Customer {
    const customer = this.customers.find(
      (customer) => customer._id === customerId,
    )

    if (!customer) {
      throw new NotFound('Cliente não foi encontrado')
    }

    return customer
  }

  static getByCpf(customerCpf: string): Customer {
    const customer = this.customers.find(
      (customer) => customer.cpf === customerCpf,
    )

    if (!customer) {
      throw new NotFound('Cliente não foi encontrado')
    }

    return customer
  }

  static getAll(page: number, limit: number): Customer[] {
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const customer = this.customers.slice(startIndex, endIndex)

    if(!customer) {
      throw new NotFound('Nenhum cliente foi encontrado')
    }

    return customer
  }

  static delete(customerId: string): boolean {
    const customerIndex = this.customers.findIndex(
      (customer) => customer._id === customerId,
    )

    if (customerIndex === -1) {
      throw new NotFound('Cliente não foi encontrado')
    }

    this.customers.splice(customerIndex, 1)
    return true
  }
}
