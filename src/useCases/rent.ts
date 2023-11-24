import { Customer } from "./customer";
import { DataInvalid, NotFound } from "./error/errors";
import { Invoice } from "./invoice";
import { compareLicense } from "./utils/rentValidation";
import { TVehicle, Vehicle } from "./vehicle";

const IVehicle = {
    'CAR' : 'B',
    'MOTORCYCLE' : 'A',
}

export class Rent {
    private _customer: Customer;
    private _vehicle: Vehicle;
    private _rentalDate: Date;
    private _devolutionDate: Date;
    private _daysRented: number;
    private _vehicleType: TVehicle;
    private _surcharge: number;
    private _invoice: Invoice;

    constructor(
        customer: Customer,
        vehicle: Vehicle,
        rentalDate: Date,
        devolutionDate: Date,
        daysRented: number,
        vehicleType: TVehicle,
        surcharge: number
    ) {
        this._customer = customer;
        this._vehicle = vehicle;
        this._rentalDate = rentalDate;
        this._devolutionDate = devolutionDate;
        this._daysRented = daysRented;
        this._vehicleType = vehicleType;
        this._surcharge = surcharge;
        this._invoice = new Invoice(customer, vehicle);
    }

    get customer(): Customer {
        return this._customer;
    }

    set customer(newCustomer: Customer) {
        this._customer = newCustomer;
    }

    get vehicle(): Vehicle {
        return this._vehicle;
    }

    set vehicle(newVehicle: Vehicle) {
        this._vehicle = newVehicle;
    }

    get rentalDate(): Date {
        return this._rentalDate;
    }

    set rentalDate(newRentalDate: Date) {
        this._rentalDate = newRentalDate;
    }

    get devolutionDate(): Date {
        return this._devolutionDate;
    }

    set devolutionDate(newDevolutionDate: Date) {
        this._devolutionDate = newDevolutionDate;
    }

    get daysRented(): number {
        return this._daysRented;
    }

    set daysRented(newDaysRented: number) {
        this._daysRented = newDaysRented;
    }

    get vehicleType(): TVehicle {
        return this._vehicleType;
    }

    set vehicleType(newVehicleType: TVehicle) {
        this._vehicleType = newVehicleType;
    }

    get surcharge(): number {
        return this._surcharge;
    }

    set surcharge(newSurcharge: number) {
        this._surcharge = newSurcharge;
    }

    // calculateTotalValue(): number {
    //     return  * this._daysRented;
    // }

    generateInvoice(): string {
        return this._invoice.generateInvoice();
    }

    calculateRent(days: number, increasePorcentage: number): number {
        const valueBase = days * this.vehicle.valueRental;
        const valueIncrease = valueBase * (increasePorcentage / 100);
        return valueBase + valueIncrease;
    }

    // TO-DO - ALUGAR VEICULO
    rentVehicle(userId: string, plate: string, rentalDate: Date): boolean {
        const user = Customer.getById(userId)

        if (!user) {
            throw new DataInvalid("Usuário Inválido")
        }

        const vehicle = Vehicle.getByPlate(plate)

        if (!vehicle) {
            throw new DataInvalid("Veículo Inválido")
        }

        if (vehicle.rented) {
            throw new NotFound("Veiculo está em uso e não poderá ser alugado")
        }

        const driverLicenseUser = user.driverLicense
        const typeVehicle = IVehicle[vehicle.type] 
        const verifyLicense = compareLicense(typeVehicle, driverLicenseUser)

        if (!verifyLicense) {
            throw new DataInvalid("Usuário não possui habilitação para dirigir este veículo")
        }

        this.vehicle.rented = true

        return true
    }

    // TO-DO
    static returnVehicle(): boolean {
        return true;
    }
}
