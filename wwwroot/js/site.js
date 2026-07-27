document.addEventListener("DOMContentLoaded", () => {
    const line = document.querySelector(".hero-line");
    const heroButtons = document.querySelectorAll(".hero-btn");
    const heroButtonsContainer = document.querySelector(".hero-buttons");
    const defaultColor = "#512bd4";

    if (line && heroButtonsContainer) {
        heroButtons.forEach(button => {
            button.addEventListener("mouseenter", () => {
                const rect = button.getBoundingClientRect();
                const parent = button.parentElement.getBoundingClientRect();
                const x = rect.left - parent.left + rect.width / 2;

                line.style.width = `${rect.width + 30}px`;
                line.style.transform =
                    `translateX(${x - line.offsetWidth / 2}px)`;

                if (button.textContent.includes("GitHub"))
                    line.style.background = "#58a6ff";
                else if (button.textContent.includes("LinkedIn"))
                    line.style.background = "#22c55e";
                else
                    line.style.background = defaultColor;
            });
        });

        heroButtonsContainer.addEventListener("mouseleave", () => {
            line.style.transform = "translateX(0px)";
            line.style.width = "150px";
            line.style.background = defaultColor;
        });
    }

    // Tarjetas de proyectos

    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".project-card");
            card.classList.add("active");
        });
    });

    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".project-card");
            card.classList.remove("active");
        });
    });

    (function () {
        const form = document.getElementById("contact-form");
        if (!form) return;

        const submitBtn = document.getElementById("submit-btn");
        const formStatus = document.getElementById("form-status");

        // --- Validación de email ---
        const emailInput = document.getElementById("Email");
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let emailError = document.createElement("p");
        emailError.className = "field-error";
        emailInput.insertAdjacentElement("afterend", emailError);

        emailInput.addEventListener("blur", validateEmail);
        emailInput.addEventListener("input", () => {
            if (emailError.textContent) validateEmail();
        });

        function validateEmail() {
            const value = emailInput.value.trim();
            if (value === "") {
                emailError.textContent = "";
                emailInput.classList.remove("input-error");
                return true;
            }
            if (!emailRegex.test(value)) {
                emailError.textContent = "Ingresá un correo válido (ej: usuario@dominio.com)";
                emailInput.classList.add("input-error");
                return false;
            }
            emailError.textContent = "";
            emailInput.classList.remove("input-error");
            return true;
        }

        // --- Captcha de emojis ---
        const captchaOptions = document.getElementById("captcha-options");
        const captchaTarget = document.getElementById("captcha-target");
        const captchaStatus = document.getElementById("captcha-status");

        const emojiBank = [
            { emoji: "🐱", name: "gato" },
            { emoji: "🐶", name: "perro" },
            { emoji: "🐸", name: "sapo" },
            { emoji: "🐵", name: "mono" },
            { emoji: "🦊", name: "zorro" },
            { emoji: "🐼", name: "panda" },
            { emoji: "🐰", name: "conejo" },
            { emoji: "🐷", name: "cerdo" }
        ];

        let correctEmoji = null;
        let captchaVerified = false;

        function shuffle(array) {
            return [...array].sort(() => Math.random() - 0.5);
        }

        function renderCaptcha() {
            captchaVerified = false;
            captchaStatus.textContent = "";

            const shuffled = shuffle(emojiBank).slice(0, 5);
            correctEmoji = shuffled[Math.floor(Math.random() * shuffled.length)];
            captchaTarget.textContent = correctEmoji.name;
            captchaOptions.innerHTML = "";

            shuffled.forEach(item => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "captcha-option";
                btn.textContent = item.emoji;
                btn.setAttribute("aria-label", item.name);

                btn.addEventListener("click", () => {
                    captchaOptions.querySelectorAll(".captcha-option").forEach(b => {
                        b.classList.remove("correct", "wrong");
                    });

                    if (item.name === correctEmoji.name) {
                        btn.classList.add("correct");
                        captchaStatus.textContent = "Verificado ✓";
                        captchaStatus.style.color = "#22c55e";
                        captchaVerified = true;
                    } else {
                        btn.classList.add("wrong");
                        captchaStatus.textContent = "Incorrecto, probá de nuevo";
                        captchaStatus.style.color = "#ef4444";
                        captchaVerified = false;
                    }
                });

                captchaOptions.appendChild(btn);
            });
        }

        renderCaptcha();

        // --- Inicializar EmailJS (al final, para no bloquear el resto si falla) ---
        if (typeof emailjs !== "undefined") {
            emailjs.init("qEvn2m6r8DFolCecT");
        } else {
            console.error("EmailJS SDK no se cargó. Revisá el <script> en _Layout.cshtml.");
        }

        // --- Envío del formulario ---
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            formStatus.textContent = "";

            if (!validateEmail()) return;

            if (!captchaVerified) {
                captchaStatus.textContent = "Verificá el captcha antes de enviar";
                captchaStatus.style.color = "#ef4444";
                return;
            }

            if (typeof emailjs === "undefined") {
                formStatus.textContent = "Error: el servicio de envío no está disponible.";
                formStatus.style.color = "#ef4444";
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            emailjs.sendForm("service_d7tno0c", "template_g7nvmqq", form)
                .then(() => {
                    formStatus.textContent = "¡Mensaje enviado! Te responderé pronto.";
                    formStatus.style.color = "#22c55e";
                    form.reset();
                    renderCaptcha();
                })
                .catch((error) => {
                    formStatus.textContent = "Hubo un error al enviar. Intentá de nuevo o escribime directo por correo.";
                    formStatus.style.color = "#ef4444";
                    console.error("EmailJS error:", error);
                })
                .finally(() => {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Enviar mensaje";
                });
        });
    })();
});