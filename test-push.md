# 🧪 Como Testar Push Notifications Facilmente

## Método 1: App em Background (Mais Fácil)

### Passo a Passo:
1. **Abra o app no celular**
2. **Faça login como VOLUNTÁRIO**
3. **Aceite permissões de notificação**
4. Verifique no console do Expo que o token foi registrado:
   ```
   📱 Expo Push Token: ExponentPushToken[xxxxx]
   ✅ Push token registrado no backend
   ```
5. **Minimize o app** (deixe em background)
6. **No seu computador**, use uma ferramenta de API (Postman, Insomnia, curl, etc.)

### Criar Vaga via API:

```bash
# 1. Faça login como INSTITUIÇÃO via API
curl -X POST http://localhost:3000/institution/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instituicao@email.com",
    "password": "senha123"
  }'

# Copie o token que retornar

# 2. Crie uma vaga
curl -X POST http://localhost:3000/institution/opportunity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Teste Push Notification",
    "description": "Vaga de teste",
    "startDate": "2025-10-20T10:00:00Z",
    "endDate": "2025-10-20T16:00:00Z",
    "hours": 6,
    "minutes": 0,
    "street": "Rua Teste",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Cidade",
    "state": "SP",
    "cep": "12345-678",
    "skills": ["Educação", "Tecnologia"],
    "maxVolunteers": 10
  }'
```

### Resultado:
🎉 **BOOM!** Push notification chega no celular mesmo com o app em background!

---

## Método 2: Dois Logins no Mesmo Dispositivo

### Preparação:
1. **Login como VOLUNTÁRIO**
2. Aceite permissões
3. Verifique que o token foi registrado
4. **Faça LOGOUT**

### Teste:
1. **Login como INSTITUIÇÃO**
2. Crie a vaga com skills do voluntário
3. **Faça LOGOUT**
4. **Login novamente como VOLUNTÁRIO**
5. Você verá a notificação **in-app** 🔔

⚠️ **Nota**: A push notification já passou porque você estava deslogado. Para ver a push, precisa estar logado quando ela chegar.

---

## Método 3: Expo Push Tool (Teste Manual)

### Passo a Passo:

1. **Obtenha o Expo Push Token**:
   - Login como voluntário no app
   - Olhe o console do Expo
   - Copie o token: `ExponentPushToken[xxxxx...]`

2. **Acesse**: https://expo.dev/notifications

3. **Configure a notificação**:
   ```json
   {
     "to": "ExponentPushToken[cole-aqui-seu-token]",
     "sound": "default",
     "title": "🎉 Nova vaga disponível!",
     "body": "Aula de Reforço Escolar - São Paulo, SP",
     "data": {
       "cardId": "id-de-uma-vaga-que-existe",
       "type": "NEW_OPPORTUNITY"
     }
   }
   ```

4. **Clique em "Send a Notification"**

5. **BOOM! 💥** Push chega no celular!

---

## Método 4: Script de Teste (Node.js)

Crie um arquivo `test-push.js`:

```javascript
const axios = require('axios');

async function testarPush() {
  try {
    // 1. Login como instituição
    const loginRes = await axios.post('http://localhost:3000/institution/login', {
      email: 'instituicao@email.com',
      password: 'senha123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login feito como instituição');

    // 2. Criar vaga (vai disparar push para voluntários)
    const vagaRes = await axios.post(
      'http://localhost:3000/institution/opportunity',
      {
        title: 'Vaga de Teste Push',
        description: 'Testando notificações push',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
        hours: 6,
        minutes: 0,
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567',
        skills: ['Educação', 'Tecnologia'], // Ajuste para skills que o voluntário tem
        maxVolunteers: 10
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Vaga criada! Push notifications enviados!');
    console.log('📱 Verifique seu celular!');
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testarPush();
```

Execute:
```bash
node test-push.js
```

---

## ✅ Checklist de Teste

### Antes de começar:
- [ ] Backend está rodando
- [ ] Voluntário tem skills cadastradas
- [ ] Voluntário fez login no app (celular físico)
- [ ] Voluntário aceitou permissões de notificação
- [ ] Push token foi registrado (veja no console)

### Durante o teste:
- [ ] App do voluntário está em background/fechado
- [ ] Criou a vaga com skills que o voluntário tem
- [ ] Push notification chegou no celular
- [ ] Ao tocar, navegou para o card correto

### Estados do app para testar:
- [ ] **App fechado** → Push chega, ao tocar abre o app
- [ ] **App em background** → Push chega, ao tocar abre o app
- [ ] **App aberto** → Banner aparece no topo, pode tocar

---

## 🎯 Recomendação Final

**Use o Método 1** (app em background + API) porque:
- ✅ Mais realista (simula usuário real)
- ✅ Você vê a push notification chegando
- ✅ Testa navegação ao tocar
- ✅ Não precisa dois dispositivos

**Ou use o Método 3** (Expo Push Tool) porque:
- ✅ Mais rápido para testar
- ✅ Controle total da mensagem
- ✅ Não depende do backend
