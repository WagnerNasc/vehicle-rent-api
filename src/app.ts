import express, { Request, Response } from 'express'
import { body, param, query, validationResult } from 'express-validator'

import { Customer, ECategoryType } from './useCases/customer'
import { TVehicle, Vehicle } from './useCases/vehicle'

import 'dotenv/config'
import { AlreadyRegistered, BadRequest, InternalServer, NotFound } from './useCases/error/errors'

/** Vehicles */

const app = express()

const PORT = process.env.PORT
app.use(express.json())

/** Customer */

const allowedCustomerCategoryTypes = Object.values(ECategoryType)

app.post(
  '/customer',
  [
    body('cpf').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('dateOfBirth').isString().notEmpty(),
    body('driverLicense')
      .isString()
      .notEmpty()
      .custom((value) => allowedCustomerCategoryTypes.includes(value)),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const customer = req.body

    try {
      const newCustomer = Customer.create(customer)

      res.status(200).send({
        data: newCustomer,
      })
    } catch (error) {
      if (error instanceof AlreadyRegistered) {
        return res.status(400).send({ message: 'Cliente já registrado' })
      }
      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

app.get(
  '/customer/:customerId',
  [param('customerId').isString()],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { customerId } = req.params

    try {
      const foundCustomer = Customer.getById(customerId)

      if (!foundCustomer) {
        throw new NotFound()
      }

      return res.status(200).send({
        data: foundCustomer,
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(400).send({ message: 'Veículo não foi encontrado' })
      }

      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

/** Vehicle */
const allowedTypes: TVehicle[] = ['CAR', 'MOTORCYCLE']

app.post(
  '/vehicle',
  [
    body('model').isString().notEmpty(),
    body('color').isString().notEmpty(),
    body('chassis').isString().notEmpty(),
    body('type')
      .isString()
      .notEmpty()
      .custom((value) => allowedTypes.includes(value)),
    body('plate').isString().notEmpty(),
    body('dailyRental').isNumeric(),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { model, color, chassis, type, plate, dailyRental } = req.body

    try {
      const vehicle: Vehicle = { model, color, chassis, type, plate, dailyRental, rented: false  } as Vehicle
      const newVehicle = Vehicle.create(vehicle)
      
      return res.status(200).send({
        data: newVehicle,
      })
    } catch (error) {
      if (error instanceof BadRequest) {
        return res.status(400).send({ message: `Veículo com placa ${plate} já cadastrado` })
      }
      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

app.get(
  '/vehicle/:plateId',
  [param('plateId').isString()],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { plateId } = req.params

    try {
      const foundVehicle = Vehicle.getByPlate(plateId)

      if (!foundVehicle) {
        throw new NotFound()
      }

      return res.status(200).send({
        data: foundVehicle,
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(400).send({ message: 'Veículo não foi encontrado' })
      }

      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

app.get(
  '/vehicles',
  [
    query('limit')
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit deve ser um número entre 1 e 100'),
    query('page')
      .isInt({ min: 1 })
      .withMessage('Page deve ser um número inteiro maior que 0'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10

    try {
      const foundVehicle = Vehicle.getAll(page, limit)

      if (!foundVehicle) {
        throw new NotFound()
      }

      return res.status(200).send({
        data: foundVehicle,
        count: foundVehicle.length,
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return res
          .status(400)
          .send({ message: 'Nenhum veículo foi encontrado' })
      }

      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

app.delete(
  '/vehicle/:plateId',
  [param('plateId').isString()],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { plateId } = req.params
      const foundVehicle = Vehicle.getByPlate(plateId)

      if (!foundVehicle) {
        throw new NotFound()
      }

      Vehicle.delete(plateId)

      return res.status(204).send()
    } catch (error) {
      if (error instanceof BadRequest) {
        return res.status(400).send({ message: 'Requisição incorreta' })
      }

      if (error instanceof NotFound) {
        return res
          .status(404)
          .send({ message: 'Nenhum veículo foi encontrado' })
      }

      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

/** Rent */

app.post(
  '/rent',
  [
    body('rentalDate').isString().notEmpty(),
    body('devolutionDate').isString().notEmpty(),
    body('categoryType')
      .isString()
      .notEmpty()
      .custom((value) => allowedCustomerCategoryTypes.includes(value)),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { cpf, name, categoryType } = req.body

    try {
      // const newCustomer = new Customer(cpf, name, categoryType)

      res.status(200).send({
        // data: newCustomer,
      })
    } catch (error) {
      return res.status(500).send({ message: new InternalServer() })
    }
  },
)

app.listen(PORT, () => {
  console.log(`🚙 Server running at ${PORT} port.`)
})
