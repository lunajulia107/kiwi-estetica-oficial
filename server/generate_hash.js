const bcrypt = require('bcrypt');

const passwordToHash = 'tais2025';
const saltRounds = 10;

bcrypt.hash(passwordToHash, saltRounds, (err, hash) => {
    if (err) {
        console.error("❌ Erro ao gerar o hash:", err);
        return;
    }

    console.log("\n-----------------------------------------");
    console.log("✅ HASH GERADO COM SUCESSO:");
    console.log(hash);
    console.log("-----------------------------------------");
    console.log("🔒 Copie e cole este hash no seu banco de dados na coluna 'senha'.");
    console.log("⚠️ Nunca salve senhas em texto puro no banco de dados!\n");
});

