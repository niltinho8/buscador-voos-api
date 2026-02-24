const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////
// PEGAR TOKEN AMADEUS
//////////////////////////////////////////////////

async function pegarToken() {

const r = await fetch(
"https://test.api.amadeus.com/v1/security/oauth2/token",
{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:
`grant_type=client_credentials&client_id=${process.env.AMADEUS_KEY}&client_secret=${process.env.AMADEUS_SECRET}`
});

const d = await r.json();

return d.access_token;
}

//////////////////////////////////////////////////
// BUSCAR VOOS
//////////////////////////////////////////////////

app.get("/voos", async (req,res)=>{

try{

const {
origem,
destino,
data,
classe
}=req.query;

const token = await pegarToken();

const url =
`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origem}&destinationLocationCode=${destino}&departureDate=${data}&adults=1&travelClass=${classe}&max=5`;

const r = await fetch(url,{
headers:{Authorization:`Bearer ${token}`}
});

const dados = await r.json();

res.json(dados);

}catch(e){

res.status(500).json({erro:"Erro ao buscar voos"});

}

});

//////////////////////////////////////////////////

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("Servidor rodando");
});
