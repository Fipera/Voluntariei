# Guia: Criar Ícone de Notificação

## Requisitos
- Tamanho: **96x96 pixels**
- Formato: **PNG**
- Fundo: **Transparente**
- Cor: **Branco** (silhueta)
- Estilo: **Simples e minimalista**

## Como Criar

### Opção 1: Online (Mais Fácil)
1. Acesse: https://www.figma.com ou https://www.canva.com
2. Crie um canvas de 96x96px
3. Desenhe um ícone de sino/coração/mão (relacionado a voluntariado)
4. Use cor branca sólida
5. Exporte como PNG com fundo transparente
6. Salve em: `Frontend/assets/images/notification-icon.png`

### Opção 2: Usar Ícone Existente
Se você já tem o ícone do app (`icon.png`):
1. Abra no GIMP ou Photoshop
2. Redimensione para 96x96px
3. Converta para branco sólido (Threshold/Ajuste de cor)
4. Remova o fundo (deixe transparente)
5. Salve como `notification-icon.png`

### Opção 3: Usar o Icon.png temporariamente
Por enquanto, você pode copiar o `icon.png`:
```bash
cd Frontend/assets/images
cp icon.png notification-icon.png
```

**Nota:** O ícone de notificação aparece na barra de status do Android quando uma notificação push chega.

## Localização
Salvar em: `/home/fipera/Documents/studyspace/Voluntariei/Frontend/assets/images/notification-icon.png`
