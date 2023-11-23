export class AlreadyRegistered extends Error {
  constructor(message = 'Cadastrado em duplicidade') {
    super(message)
  }
}

export class NotFound extends Error {
  constructor(message = 'Não encontrado') {
    super(message)
  }
}

export class DataInvalid extends Error {
  constructor(message = 'Dado inválido') {
    super(message)
  }
}

export class BadRequest extends Error {
  constructor(message = 'Solicitação inválida') {
    super(message)
  }
}

export class InternalServer extends Error {
  constructor(message = 'Erro no servidor') {
    super(message)
  }
}
