# Fight Team Vinhedo

Site institucional em React + TypeScript + Vite, com CSS próprio.

## Abrir no computador

No PowerShell, dentro de C:\Projetos\Fight-Team:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra o endereço exibido no terminal.

## Gerar a versão para publicação

```powershell
npm.cmd run build
```

A saída fica na pasta dist.

## Cloudflare Workers

- Root directory: /
- Build command: npm run build
- Deploy command: npx wrangler deploy
- Nome do Worker: fight-team-vinhedo

O arquivo wrangler.jsonc aponta para dist. O repositório no GitHub precisa conter um commit na branch configurada para o Cloudflare conseguir cloná-lo.

## Conteúdo

- src/App.tsx: textos, modalidades, horários, planos e links.
- src/App.css: estilos e adaptação ao celular.
- src/index.css: fontes e estilos gerais.
- public/logo.jpg: logo fornecido pelo cliente.
- index.html: título e descrição para mecanismos de busca.

Horários transcritos da referência enviada. Confirme a grade antes da publicação.

O agendamento abre uma conversa no WhatsApp com modalidade e público escolhidos. Nenhum agendamento é confirmado automaticamente. Não há gravação de dados nem integração com Supabase nesta versão.
