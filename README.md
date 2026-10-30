# FocusMatriz

Controle de pendências pela Matriz Eisenhower, feito para usar no celular.
App: https://rjrafaelsoares2022-ops.github.io/Gastos/

- **Q1 🔥 Faça agora**: urgente e importante
- **Q2 ⚡ Resolva logo**: urgente
- **Q3 ⭐ Agende**: importante
- **Q4 ☕ Quando der**: sem pressa, mas tem que ser feito

A tela mostra o que é para hoje e o que ficou atrasado. Tarefas com data futura ficam em "Próximos dias".
Concluir tira a tarefa da tela; ela fica em "Concluídas" (menu `⋯`) para voltar se precisar. Apagadas ficam 30 dias na lixeira.

As tarefas ficam salvas no aparelho. No menu `⋯` dá para exportar e importar planilhas Excel.

## Comando de voz e texto rápido

Toque no 🎤 (ou digite no campo de cima) e fale, por exemplo:
- `Q1, trabalho, fazer slide`
- `pai comprar remédio amanhã às 15h`
- `quando der, pessoal, lavar o carro`

No começo da frase o app entende quadrante (Q1 a Q4, "urgente e importante", "urgente", "importante", "quando der"),
área (trabalho, pessoal), subcategoria (pai, casa ilha...) e data; no fim, data e horário. O resto vira o título.

## Celular e computador sincronizados

As tarefas podem ficar numa planilha Google sua (pasta `nuvem/`). Configure uma vez em `⋯ › Sincronizar celular e computador`:
cole `nuvem/Code.gs` em Extensões › Apps Script da planilha, implante como App da Web
(executar como você, acesso para qualquer pessoa) e cole o endereço no app.
No outro aparelho, abra o link de conexão que o app gera.
