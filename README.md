# Imobilearea

Este projeto foi desenvolvido como parte da disciplina de **Construção de Software** e consiste em um aplicativo voltado para a **listagem de imóveis**. O objetivo é aplicar os conceitos aprendidos em sala de aula, abordando boas práticas de desenvolvimento, organização de código e integração com banco de dados.

---

## 🚀 **Configurando o Ambiente**

### **1. Clonar o Repositório**

```bash
git clone https://github.com/murilob03/imobilearea.git
cd imobilearea
```

### **2. Instalar Dependências**

Execute o seguinte comando para instalar as dependências do projeto:

```bash
npm install
```

### **3. Configurar o Arquivo `.env`**

Crie um arquivo chamado `.env` na pasta raiz do projeto e adicione as seguintes variáveis:

```plaintext
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

> **Nota:** Substitua `your_random_secret_key` por uma chave secreta segura. Você pode gerar uma com o comando:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **4. Configurar o Banco de Dados (Prisma)**

Se o banco de dados ainda não foi criado (ou seja, o arquivo `/prisma/dev.db` não existe), execute:

```bash
npx prisma db push
```

Para adicionar dados de teste automaticamente, use:

```bash
npx prisma db seed
```

---

## 🚀 **Rodar o Servidor de Desenvolvimento**

Após configurar o ambiente, execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar o projeto.

> **Nota:** A aplicação é atualizada automaticamente ao editar os arquivos.

---

## 🛠 **Edição Rápida**

Você pode começar a editar a página principal no arquivo:

```
app/page.tsx
```

Alterações feitas no arquivo serão refletidas automaticamente no navegador.

Este projeto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar fontes, como a [Geist](https://vercel.com/font).

---

## 🚀 **Deploy na Vercel**

A forma mais fácil de fazer o deploy é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

---

## 🗃 **Prisma - Gerenciando Banco de Dados**

Se precisar atualizar o banco de dados após modificar o schema Prisma, use:

```bash
npx prisma db push
```

Se for necessário popular o banco com dados iniciais, execute:

```bash
npx prisma db seed
```

### **Acessar o Banco de Dados com Prisma Studio**

Para visualizar e gerenciar os dados no banco durante o desenvolvimento, execute:

```bash
npx prisma studio
```

---

## 👥 **Autores**

- **[Gustavo Henrique Trassi Ganaza]** - _Desenvolvedor_ - [GitHub](https://github.com/GustavoGNZ)
- **[Juliana Naomi Kawakami]** - _Desenvolvedor_ - [GitHub](https://github.com/juliana-kawakami)
- **[Murilo Boccardo]** - _Desenvolvedor_ - [GitHub](https://github.com/murilob03)
- **[Yoshiyuki Fujie]** - _Desenvolvedor_ - [GitHub](https://github.com/Yoshifg)

> Sinta-se à vontade para entrar em contato através dos perfis acima para dúvidas ou sugestões relacionadas ao projeto.
