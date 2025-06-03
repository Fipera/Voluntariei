# APLICATIVO MÓVEL PARA ALOCAÇÃO DE VOLUNTÁRIOS EM AÇÕES FILANTRÓPICAS

O **Voluntari-ei** é um aplicativo móvel desenvolvido como Trabalho de Conclusão de Curso (TCC) com o objetivo de conectar instituições filantrópicas a voluntários dispostos a contribuir com causas sociais. A plataforma facilita a divulgação de oportunidades de voluntariado e a inscrição de pessoas com habilidades compatíveis.

## 🚀 Tecnologias Utilizadas

### Frontend
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Gluestack UI v2](https://ui.gluestack.io/)
- [NativeWind](https://www.nativewind.dev/)

### Backend
- [Fastify](https://fastify.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## 📱 Funcionalidades

### Para Voluntários
- Cadastro e login com autenticação segura
- Visualização de oportunidades disponíveis
- Aceitação de ações filantrópicas
- Histórico de participações

### Para Instituições
- Cadastro institucional com CNPJ
- Criação e gerenciamento de oportunidades
- Acompanhamento de voluntários inscritos

## 🧪 Validação

A validação do sistema será feita com base nos **casos de uso modelados**, seguindo um passo a passo detalhado com evidências visuais (prints ou vídeos). Os testes envolvem:

- Testes funcionais de inputs e outputs
- Testes de integração entre frontend e backend
- Testes de sistema e usabilidade


## 👨‍💻 Autores

- Marcos Guisleri ([@marcosguisleri](https://github.com/marcosguisleri))
- Filipe Bello — ([@Fipera](https://github.com/Fipera))

---

# 🚀 TESTAR PROJETO – VOLUNTARI-EI

# 1) Clone o repositório e entre na pasta raiz
- git clone https://github.com/<seu-usuario>/Voluntariei.git
- cd Voluntariei

# 2) Suba PostgreSQL + Redis com Docker
- docker compose up -d    # portas 5432 (Postgres) e 6379 (Redis)

# 3) Instale dependências e rode o BACK-END
- cd backend
- npm install
- cp .env.example .env    # edite se necessário
- npx prisma migrate deploy
- npm run dev             # Fastify em http://localhost:3333


# 4) Instale dependências e rode o FRONT-END (Expo)
- cd frontend
- npm install
- npx expo start          # QR-code para Expo Go ou emulador



> Projeto desenvolvido como parte do curso de Sistemas de Informação. Tema: Tecnologia Social para o engajamento filantrópico.



