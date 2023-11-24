import { Customer } from "./customer";
import { BadRequest, DataInvalid, NotFound } from "./error/errors";
import { Invoice } from "./invoice";
import { compareLicense, verifyCustomer, verifyVehicle } from "./utils/rentValidation";
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
    private _invoice: Invoice;
    private _valueRental: number;

    private static listOfRent: Rent[] = [];

    constructor(
        customer: Customer,
        vehicle: Vehicle,
        rentalDate: Date,
        devolutionDate: Date,
    ) {
        this._customer = customer;
        this._vehicle = vehicle;
        this._rentalDate = rentalDate;
        this._devolutionDate = devolutionDate;
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

    static calculateRent(vehicle: Vehicle, days: number, increasePorcentage: number): number {
        const valueBase = days * vehicle.dailyRental;
        const valueIncrease = valueBase * (increasePorcentage / 100);
        return valueBase + valueIncrease;
    }

    static rentVehicle(customer: Customer, vehicle: Vehicle, rentalDate: Date, devolutionDate: Date): boolean {
        const customer1 = Customer.getById(customer.id)
        verifyCustomer(customer)

        const vehicle1 = Vehicle.getByPlate(vehicle.plate)
        verifyVehicle(vehicle)

        const driverLicenseUser = customer1.driverLicense
        const typeVehicle = IVehicle[vehicle1.type] 
        const verifyLicense = compareLicense(typeVehicle, driverLicenseUser)

        if (!verifyLicense) {
            throw new DataInvalid("Usuário não possui habilitação para dirigir este veículo")
        }

        vehicle1.rented = true

        const days = (devolutionDate.getDay() - rentalDate.getDay())
        const increasePorcentage = vehicle1.type === 'CAR' ? 10 : 5;
        const valueRental = this.calculateRent(vehicle1, days, increasePorcentage)

        const newRent = new Rent(customer1, vehicle1, rentalDate, devolutionDate)
        Rent.listOfRent.push(newRent)
        return true
    }

    // TO-DO
    // returnVehicle(cpf: string, plate: string): boolean {



    //     return true;
    // }
}
