import { Customer } from "./customer";
import { Vehicle } from "./vehicle";

export class Invoice {
    private _customer: Customer;
    private _vehicle: Vehicle;

    constructor(user: Customer, vehicle: Vehicle) {
        this._customer = user;
        this._vehicle = vehicle;
    }

    generateInvoice(): string {
        return `
        ============ FATURA DO CLIENTE ============
        Nome do cliente: ${this._customer.name}
        CPF: ${this._customer.cpf}
        CNH: ${this._customer.driverLicense}
        ------------ DADOS DO VEÍCULO -------------
        Placa: ${this._vehicle.plate}
        Tipo: ${this._vehicle.type}
        Modelo: ${this._vehicle.model}
        Valor do aluguel: ${this._vehicle.valueRental}
        `;
    }
}