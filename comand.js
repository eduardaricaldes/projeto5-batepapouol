// etapa 1 - Preciso da biblioteca axios
// etapa 2: preciso pegar as receitas no servidor ( enviar a cartinha ) 
// etapa 3: receber a resposta (cartinha) do servidor 
// etapa 4: processar a resposta e mostrar na tela ( renderizar ) as receitas
const privateLabel='private_message';
const messageLabel= 'message';
const statusLabel= 'status';
let username= '';
let isUserOnline = false;


function messageStatus(id, from, text, time) {
  const html = 
  `
    <li class="message status" message-id=${id}>
      <p>
        <span class="message-time">(${time})</span>
        <span class="message-user">${from}</span>
        <span class="message-data">${text}</span>
      </p>
    </li>  
  `
  return html;
}

function messageMessage(id, from, to, text, type, time) {
  let classType = '';
  if(type=== privateLabel){
    classType='private';
  }
  const html = 
  `
    <li class="message ${classType}" message-id=${id}>
      <p>
        <span class="message-time">(${time})</span>
        <span class="message-user">${from}</span>
        <span class="message-user-to">
          para <span class="message-user">${to}</span></span
        >
        :
        <span class="message-data">${text}</span>
      </p>
    </li>
  `
  return html;
}

const messages= document.querySelector('.messages');

function dadosChegaram(resposta){
  const data = resposta.data;
  let html = '';
  for (let i = 0; i<data.length;i++) {
    if (data[i].type===statusLabel){
      html+=messageStatus(i,data[i].from,data[i].text,data[i].time);
    }else{
      html+=messageMessage(i, data[i].from,data[i].to,data[i].text,data[i].type,data[i].time);
    }
  }

  messages.innerHTML = html;
  const messagesOnBoard = document.querySelectorAll('.message');
  const lastElement = messagesOnBoard[data.length-1];
  lastElement.scrollIntoView();
}

function isOnline() {
  axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {
    name: username,
  });
}

function refreshChat() {
  const dados= axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  dados.then(dadosChegaram);
}

function app(){
  let response;
  if(!isUserOnline){
    const name= prompt('Qual o seu lindo nome?')
    response= axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {
      name: name,
    });
    response
      .then((res) => {
        username = name;
        isUserOnline = true;
        refreshChat();
        app();
      })
      .catch(() => {
        app();
      });
  }
  
  if(isUserOnline){
    setInterval(()=>{
      refreshChat();
    }, 3000);

    setInterval(()=>{
      isOnline();
    }, 5000);
  }
  
}

app();
