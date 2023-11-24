import { BadRequest, NotFound } from './error/errors'

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

  get chassis(): string {
    return this._chassis
  }

  get type(): TVehicle {
    return this._type
  }

  get plate(): string {
    return this._plate
  }

  get dailyRental(): number {
    return this._dailyRental
  }

  get rented(): boolean {
    return this._rented
  }

  get increasePorcentage(): number {
    return this._increasePorcentage
  }

  set color(newColor: string) {
    this._color = newColor
  }

  set chassis(newChassis: string) {
    this._chassis = newChassis
  }

  set type(newType: TVehicle) {
    this._type = newType
  }

  set plate(newPlate: string) {
    this._plate = newPlate
  }

  set dailyRental(newDailyRental: number) {
    if (newDailyRental <= 0) {
      throw new BadRequest('O valor do aluguel deve ser maior que zero')
    }
    this._dailyRental = newDailyRental
  }

  set rented(newRented: boolean) {
    if (this._rented === newRented) {
      throw new BadRequest('Não pode ser alterado para o mesmo status')
    }
    this._rented = newRented
  }

  static findPlate(plate: string): boolean {
    return this.vehicles.some(vehicle => vehicle.plate === plate)
  }

  static create(vehicle: Vehicle): Vehicle {
    const alreadyExistsVehicle = this.findPlate(vehicle.plate)

    if(alreadyExistsVehicle){
      throw new BadRequest('Veículo não encontrado')
    } 

    this.vehicles.push(vehicle)

    return vehicle
  }

  // TO-DO - DEVOLVER VEÍCULO
  // returnVehicle(userId: string, place: string): void {}

  static delete(plate: string): boolean | undefined {
    const index = this.vehicles.findIndex(
      (vehicle) => vehicle.plate === plate,
    )

    if (index === -1) {
      throw new NotFound('Veículo não encontrado')
    }

    const vehicle = this.vehicles[index]

    if (vehicle.rented) {
      throw new BadRequest('Veículo alugado e não pode ser excluído')
    }

    this.vehicles.splice(index, 1)

    return true
  }

  static getByPlate(plate: string): Vehicle  {
    const vehicle = this.vehicles.filter(
      (vehicle) => vehicle.plate === plate,
    )[0]

    if (!vehicle) {
      throw new NotFound('Veículo não foi encontrado')
    }

    return vehicle
  }

  static getAll(page: number, limit: number): Vehicle[] | [] {
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const vehicle = this.vehicles.slice(startIndex, endIndex)

    if(!vehicle) {
      throw new NotFound('Nenhum veículo foi encontrado')
    }

    return vehicle
  }

  static listRentedVehicles(): Vehicle[] {
    return this.vehicles.filter((vehicle) => vehicle._rented === true)
  }

  static listAvailableVehicles(): Vehicle[] {
    return this.vehicles.filter((vehicle) => vehicle._rented === false)
  }
}
