# MinimercadoFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

#### Minimercado Frontend

## 🧾 Visão Geral
Este projeto é o frontend de um sistema de gestão para minimercado, desenvolvido com Angular. Ele permite que os usuários interajam com o sistema de forma intuitiva, realizando operações como cadastro de produtos, controle de estoque, registro de vendas e visualização de relatórios.

## 🛠️ Tecnologias Utilizadas
- Angular 15+
- TypeScript
- HTML5 & CSS3
- Bootstrap ou Angular Material
- RxJS
- API REST (Laravel Backend)

## ⚙️ Instalação

### Requisitos
- Node.js >= 16
- Angular CLI

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/Bnhamadjo/minimercado-frontend.git
   cd minimercado-frontend
   ``
### Instale as dependências:
    1. npm install

### 🔧 Configuração

    Configure o ambiente em src/environments/environment.ts com a URL da API do backend Laravel.
    Exemplo:
    export const environment = {
   production: false,
   apiUrl: 'http://localhost:8000/api'
 };

### 📦 Funcionalidades

1. Cadastro e edição de produtos
2. Controle de estoque com alertas
3. Registro de vendas
4. Visualização de relatórios
5. Autenticação de usuários
6. Interface responsiva e amigável

### 👤 Autor
Braima Nhamadjo
GitHub: @Bnhamadjo