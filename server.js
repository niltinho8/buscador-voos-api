const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

let token = "";

async function getToken() {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
    }
  );

  const data = await response.json();
  token = data.access_token;
}

app.get("/voos", async (req, res) => {
  try {
    if (!token) await getToken();

    const { origem, destino, data } = req.query;

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origem}&destinationLocationCode=${destino}&departureDate=${data}&adults=1&max=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resultado = await response.json();
    res.json(resultado);
  } catch (error) {
    res.json({ erro: "Erro ao buscar voos" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
