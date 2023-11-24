import { Customer } from "./customer";
import { Invoice } from "./invoice";
import { TVehicle, Vehicle } from "./vehicle";

export class Rent {
    private _customer: Customer;
    private _vehicle: Vehicle;
    private _rentalDate: Date;
    private _devolutionDate: Date;
    private _dailyRate: number;
    private _daysRented: number;
    private _vehicleType: TVehicle;
    private _surcharge: number;
    private _invoice: Invoice;

    constructor(
        customer: Customer,
        vehicle: Vehicle,
        rentalDate: Date,
        devolutionDate: Date,
        dailyRate: number,
        daysRented: number,
        vehicleType: TVehicle,
        surcharge: number
    ) {
        this._customer = customer;
        this._vehicle = vehicle;
        this._rentalDate = rentalDate;
        this._devolutionDate = devolutionDate;
        this._dailyRate = dailyRate;
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

    get dailyRate(): number {
        return this._dailyRate;
    }

    set dailyRate(newDailyRate: number) {
        this._dailyRate = newDailyRate;
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

    calculateTotalValue(): number {
        return this._dailyRate * this._daysRented;
    }

    genrateInvoice(): string {
        return this._invoice.generateInvoice();
    }

}