// ================================
// CONFIGURAÇÃO
// ================================
const WEBHOOK_URL = "https://discord.com/api/webhooks/1455502427762589756/2dxRVXSaFNfqCJEJXTUvkb1EtjlKMtGh6B_pknagBts0wrHSQR77JWn6KqFNOZlGG4wU";

// ================================
// FORMULÁRIO DE CONTATO
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const messageBox = document.getElementById("formMessage");
    const submitBtn = document.getElementById("submitBtn");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerText = "Enviando...";

        const nome = document.getElementById("nome").value;
        const empresa = document.getElementById("empresa").value || "Não informado";
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const solucao = document.getElementById("solucao").value;
        const mensagem = document.getElementById("mensagem").value;
        const privacidade = document.getElementById("privacidade").checked;

        if (!privacidade) {
            showMessage("Aceite a política de privacidade.", "error");
            resetButton();
            return;
        }

        const payload = {
            embeds: [{
                title: "📩 Novo contato - Site",
                color: 0x8e44ad,
                fields: [
                    { name: "👤 Nome", value: nome },
                    { name: "🏢 Empresa", value: empresa },
                    { name: "📧 Email", value: email },
                    { name: "📱 Telefone", value: telefone },
                    { name: "🎯 Solução", value: solucao },
                    { name: "💬 Mensagem", value: mensagem }
                ],
                footer: {
                    text: new Date().toLocaleString("pt-BR")
                }
            }]
        };

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Erro ao enviar");

            showMessage("Mensagem enviada com sucesso! ✅", "success");
            form.reset();

        } catch (err) {
            console.error(err);
            showMessage("Erro ao enviar. Tente novamente.", "error");
        }

        resetButton();
    });

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.innerText = "Enviar";
    }

    function showMessage(text, type) {
        messageBox.innerText = text;
        messageBox.className = `form-message ${type}`;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 8000);
    }
});
