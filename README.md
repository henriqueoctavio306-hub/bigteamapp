# BIGTEAM — Standalone

Versão independente e local-first do BIGTEAM Fitness Hub.

## O que esta versão resolve
- Não depende de Lovable Cloud Auth.
- Não depende de Google OAuth.
- Não depende de Supabase.
- Não depende de API externa para abrir e usar o app.
- Tem fluxo Personal e Aluno, com treino, dieta, check-ins, pagamentos, mensagens e evolução.
- Dados são persistidos no `localStorage` do navegador.
- Inclui `vercel.json` para SPA e pode ser publicado como site estático.

## Rodar
```bash
npm install
npm run build
npm run dev
```

## Importante
Esta versão é local-first. Os dados ficam no navegador/dispositivo e não sincronizam entre aparelhos ou usuários. Ela é adequada para validar a experiência do produto sem infraestrutura externa. Para transformar em SaaS multiusuário, o próximo passo é adicionar um backend/banco persistente.
