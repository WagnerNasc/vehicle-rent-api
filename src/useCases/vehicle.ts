import { randomUUID } from 'crypto'
import { BadRequest, DataInvalid, NotFound } from './error/errors'

export type TVehicle = 'CAR' | 'MOTORCYCLE'

export class Vehicle {
  private _model: string
  private _color: string
  private _chassis: string
  private _type: TVehicle
  private _plate: string
  private _dailyRental: number
  private _rented = false

  private _increasePorcentage = 0

  static vehicles: Vehicle[] = []

  constructor(
    model: string,
    color: string,
    chassis: string,
    type: TVehicle,
    plate: string,
    dailyRental: number,
    rented: boolean,
  ) {
    this._model = model
    this._color = color
    this._chassis = chassis
    this._type = type
    this._plate = plate
    this._dailyRental = dailyRental
    this._rented = rented

    // TO-DO validar dados de entrada
    // TO-DO validar duplicidade
    Vehicle.vehicles.push(this)
  }

  get model(): string {
    return this._model
  }

  set model(newModel: string) {
    this._model = newModel
  }

  get color(): string {
    return this._color
  }

  set color(newColor: string) {
    this._color = newColor
  }

  get chassis(): string {
    return this._chassis
  }

  set chassis(newChassis: string) {
    this._chassis = newChassis
  }

  get type(): TVehicle {
    return this._type
  }

  set type(newType: TVehicle) {
    this._type = newType
  }

  get plate(): string {
    return this._plate
  }

  set plate(newPlate: string) {
    this._plate = newPlate
  }

  get dailyRental(): number {
    return this._dailyRental
  }

  set dailyRental(newDailyRental: number) {
    if (newDailyRental <= 0) {
      throw new BadRequest('O valor do aluguel deve ser maior que zero')
    }
    this._dailyRental = newDailyRental
  }

  get rented(): boolean {
    return this._rented
  }

  set rented(newRented: boolean) {
    if (this._rented === newRented) {
      throw new BadRequest('Não pode ser alterado para o mesmo status')
    }
    this._rented = newRented
  }

  get increasePorcentage(): number {
    return this._increasePorcentage
  }

  static findPlate(plate: string): boolean {
    return Vehicle.vehicles.find(v => v._plate == plate) ? true : false
  }

  static create(vehicle: Vehicle): void {
    const alreadyExistsVehicle = Vehicle.findPlate(vehicle.plate)

    if(alreadyExistsVehicle){
      throw new BadRequest(`Veículo com placa ${vehicle.plate} já cadastrado`)
    } 

    const id = randomUUID()

    // Vehicle.vehicles.push(newVehicle)
    Vehicle.vehicles.push(vehicle)
  }

  // TO-DO - DEVOLVER VEÍCULO
  // returnVehicle(userId: string, place: string): void {}

  static delete(plate: string): boolean | undefined {
    const index = Vehicle.vehicles.findIndex(
      (vehicle) => vehicle.plate === plate,
    )

    if (index === -1) {
      throw new NotFound()
    }

    const vehicle = Vehicle.vehicles[index]

    if (vehicle._rented) {
      throw new BadRequest()
    }

    Vehicle.vehicles.splice(index, 1)

    return true
  }

  static getByPlate(plate: string): Vehicle  {
    const response = Vehicle.vehicles.filter(
      (vehicle) => vehicle._plate === plate,
    )[0]

    return response
  }

  static getAll(page: number, limit: number): Vehicle[] | [] {
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    return Vehicle.vehicles.slice(startIndex, endIndex)
  }

  static listRentedVehicles(): Vehicle[] {
    return Vehicle.vehicles.filter((vehicle) => vehicle._rented === true)
  }

  static listAvailableVehicles(): Vehicle[] {
    return Vehicle.vehicles.filter((vehicle) => vehicle._rented === false)
  }
}
