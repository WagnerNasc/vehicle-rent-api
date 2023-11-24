import { Customer } from "./customer";
import { Rent } from "./rent";
import { Vehicle } from "./vehicle";

export class Invoice {

    static generateInvoice(rent: Rent): string {

        return `
        ============ FATURA DO CLIENTE ============
        Nome do cliente: ${rent.customer.name}
        CPF: ${rent.customer.cpf}
        CNH: ${rent.customer.driverLicense}
        ------------ DADOS DO VEÍCULO -------------
        Placa: ${rent.vehicle.plate}
        Tipo: ${rent.vehicle.type}
        Modelo: ${rent.vehicle.model}
        Diária: ${rent.vehicle.dailyRental}
        ------------ DADOS DO ALUGUEL -------------
        Data de aluguel: ${rent.rentalDate}
        Data de devolução: ${rent.devolutionDate}
        Valor do aluguel: ${rent.valueRental}
        `;
    }
}