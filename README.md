# Vehicle Rent API

This project aims to provide rent vehicles.

## Running Project

2. Install Dependencies:
     ```shell
     npm i
     ```

3. Running application:
     ```shell
     npm run start:dev
     ```


# Locadora de Veículos

## Descrição do que foi solicitado.

Desenvolvimento de Sistema para Locadora de Veículos
Contexto e Requisitos

A equipe, composta por no mínimo 2 e no máximo 4 integrantes, foi contratada para desenvolver
um sistema de locadora de veículos. Este sistema será projetado utilizando a linguagem de
programação TypeScript, ou no máximo JavaScript Vanilla, permitindo uma interface via terminal ou
qualquer interface gráfica.

## Regras de Negócio Estabelecidas pelo Cliente
### Cadastro de Veículos:
- [x] 1. Não é permitido cadastrar veículos com a mesma placa de outro já registrado no sistema. - Bart
- [x] 2. As informações a serem cadastradas dos veículos devem incluir o valor da hora de aluguel. - Bart

### Aluguel de Veículos:
- [x] 1. Para alugar um veículo, o cliente deve fornecer nome, CPF e o tipo de carteira. - Pablo
- [x] 2. Se o tipo de carteira do cliente for "A", ele só poderá alugar uma moto; se for "B", apenas um carro. - Pablo
- [x] 3. Cada cliente pode alugar apenas um veículo por vez, e não deve estar alugando nenhum outro veículo no momento de realizar um novo aluguel.
- [x] 4. Ao alugar um veículo, deve-se realizar um cálculo considerando o valor da diária, os dias a serem alugados e um acréscimo conforme o tipo de veículo. Carros terão um acréscimo de 10%,
enquanto motos terão 5%.

### Devolução de Veículos:
- [x] 1. A devolução do veículo requer o fornecimento do CPF do cliente e a placa do veículo. - Pablo
- [x] 2. Não é permitido excluir um veículo que esteja atualmente alugado.

### Faturamento:
- [x] 1. O sistema, quando solicitado, deve apresentar a fatura a ser paga pelo cliente, detalhando o custo do aluguel de cada veículo. Gabriel

### Funcionalidades do Sistema
- [x] 1. Cadastrar veículo
- [x] 2. Alugar veículo - Pablo
- [x] 3. Devolver veículo - Pablo
- [x] 4. Listar veículos disponíveis - Wagner
- [x] 5. Listar veículos alugados - Wagner
- [x] 6. Mostrar fatura do cliente - Gabriel
<!-- - [ ] 7. Sair do sistema - Bart -->

## Entrega do Projeto
- O código fonte do projeto deve ser desenvolvido em TypeScript ou, no máximo, em JavaScript
Vanilla.
- A interface pode ser implementada via terminal ou qualquer interface gráfica (HTML e CSS, por
exemplo).
- A equipe deve ser composta por no mínimo 2 e no máximo 4 integrantes.
- O código deve ser entregue via link de repositório remoto (por exemplo, GitHub) ou em arquivo
zipado.
- A entrega deve ser feita através do sistema escolar LMS designado para este curso.
- Observação: Certifique-se de seguir as boas práticas de desenvolvimento, documentação
adequada e teste do código antes da entrega.