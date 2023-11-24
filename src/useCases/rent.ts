import { Customer } from "./customer";
import { BadRequest, DataInvalid, NotFound } from "./error/errors";
import { Invoice } from "./invoice";
import { compareLicense } from "./utils/rentValidation";
import { Vehicle } from "./vehicle";

const IVehicle = {
    'CAR' : 'B',
    'MOTORCYCLE' : 'A',
}

export class Rent {
    private _customer: Customer;
    private _vehicle: Vehicle;
    private _rentalDate: Date;
    private _devolutionDate: Date;
    private _surcharge: number;
    private _invoice: Invoice;
    private _valueRental: number;

    private static listOfRent: Rent[] = [];

    constructor(
        customer: Customer,
        vehicle: Vehicle,
        rentalDate: Date,
        devolutionDate: Date,
        surcharge: number
    ) {
        this._customer = customer;
        this._vehicle = vehicle;
        this._rentalDate = rentalDate;
        this._devolutionDate = devolutionDate;
        this._surcharge = surcharge;
        this._invoice = new Invoice(customer, vehicle);
        this._valueRental = 0;
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

    get surcharge(): number {
        return this._surcharge;
    }

    set surcharge(newSurcharge: number) {
        this._surcharge = newSurcharge;
    }

    get valueRental(): number {
        return this._valueRental;
    }

    set valueRental(newValueRental: number) {
        this._valueRental = newValueRental;
    }

    // calculateTotalValue(): number {
    //     return  * this._daysRented;
    // }

    generateInvoice(): string {
        return this._invoice.generateInvoice();
    }

    calculateRent(days: number, increasePorcentage: number): number {
        const valueBase = days * this.vehicle.dailyRental;
        const valueIncrease = valueBase * (increasePorcentage / 100);
        return valueBase + valueIncrease;
    }

    // TO-DO - ALUGAR VEICULO
    rentVehicle(): boolean {
        const customer = Customer.getById(this._customer.id)

        if (!customer) {
            throw new DataInvalid("Usuário Inválido")
        }

        if(customer.hasRent){
            throw new BadRequest("Usuário já possui um veículo alugado")
        }

        const vehicle = Vehicle.getByPlate(this.vehicle.plate)

        if (!vehicle) {
            throw new DataInvalid("Veículo Inválido")
        }

        if (vehicle.rented) {
            throw new BadRequest("Veiculo está em uso e não poderá ser alugado")
        }

        const driverLicenseUser = customer.driverLicense
        const typeVehicle = IVehicle[vehicle.type] 
        const verifyLicense = compareLicense(typeVehicle, driverLicenseUser)

        if (!verifyLicense) {
            throw new DataInvalid("Usuário não possui habilitação para dirigir este veículo")
        }

        this.vehicle.rented = true

        const days = (this._devolutionDate.getDay() - this._rentalDate.getDay())
        const increasePorcentage = this.vehicle.type === 'CAR' ? 10 : 5;
        this._valueRental = this.calculateRent(days, increasePorcentage)
        // TODO

        Rent.listOfRent.push(this)
        return true
    }

    // TO-DO
    static returnVehicle(): boolean {
        return true;
    }
}
