document.addEventListener("DOMContentLoaded", () => {

 /* 生日密碼 */
const passwordScreen = document.getElementById("password-screen");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");

if (passwordScreen && passwordForm && passwordInput) {

    // 這個分頁已經輸入過正確密碼
    if (sessionStorage.getItem("birthdayUnlocked") === "true") {
        passwordScreen.remove();
    } else {
        document.body.style.overflow = "hidden";

        passwordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (passwordInput.value.trim() === "1025") {
                sessionStorage.setItem("birthdayUnlocked", "true");

                passwordError.textContent = "";
                passwordScreen.classList.add("is-hidden");
                document.body.style.overflow = "";

                setTimeout(() => {
                    passwordScreen.remove();
                }, 1000);
            } else {
                passwordError.textContent = "密碼錯誤，請再試一次";
                passwordInput.value = "";
                passwordInput.focus();
            }
        });
    }
}

/* 手機選單 */
    const menuButton = document.querySelector(".menu-button");
    const siteNav = document.querySelector(".site-nav");
    if (menuButton && siteNav) {
        const setMenu = (isOpen) => {
            menuButton.classList.toggle("is-open", isOpen);
            siteNav.classList.toggle("is-open", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
        };
        menuButton.addEventListener("click", () => {
            setMenu(!menuButton.classList.contains("is-open"));
        });
        siteNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                const destination = new URL(link.href, window.location.href);

                if (destination.pathname === window.location.pathname) {
                    setMenu(false);
                }
            });
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setMenu(false);
        });
    }
/* 照片輪播 */
    const track = document.querySelector(".gallery-track");
    const prev = document.querySelector(".gallery-prev");
    const next = document.querySelector(".gallery-next");

    if (track && prev && next) {
        const images = [...track.querySelectorAll("img")];
        const active = images.filter(img => img.getAttribute("src")?.trim());

        if (active.length > 1) {
            // 空白圖片保留在 HTML，輪播時暫時隱藏
            images.forEach(img => {
                if (!img.getAttribute("src")?.trim()) {
                    img.style.display = "none";
                }
            });

            // 複製照片，形成無限輪播
            for (let i = 0; i < 3; i++) {
                active.forEach(img => {
                    const clone = img.cloneNode(true);
                    clone.setAttribute("aria-hidden", "true");
                    track.appendChild(clone);
                });
            }

            let position = 0;
            let cycle = 0;
            let hovering = false;
            let touching = false;
            let lastTime = 0;

            const speed = 30;

            const render = () => {
                track.style.transform =
                    `translate3d(${-Math.round(position)}px, 0, 0)`;
            };

            const updateSize = () => {
                const oldCycle = cycle;

                cycle = active.reduce((total, img) => {
                    return total + img.getBoundingClientRect().width + 20;
                }, 0);

                if (!cycle) return;

                if (!oldCycle) {
                    position = cycle;
                } else {
                    position += cycle - oldCycle;
                }

                render();
            };

            const normalize = () => {
                if (!cycle) return;

                while (position < cycle) {
                    position += cycle;
                }

                while (position >= cycle * 2) {
                    position -= cycle;
                }
            };

            const animate = (time) => {
                if (lastTime && !hovering && !touching && cycle) {
                    const delta = Math.min((time - lastTime) / 1000, 0.05);

                    position += speed * delta;
                    normalize();
                    render();
                }

                lastTime = time;
                requestAnimationFrame(animate);
            };

            // 左右箭頭：每次移動可視區域的 70%
            const move = (direction) => {
                if (!cycle) return;

                const distance = track.parentElement.clientWidth * 0.7;

                position += direction * distance;
                normalize();
                render();
            };

            prev.addEventListener("click", () => move(-1));
            next.addEventListener("click", () => move(1));

            track.addEventListener("mouseenter", () => {
                hovering = true;
            });

            track.addEventListener("mouseleave", () => {
                hovering = false;
            });

            track.addEventListener("touchstart", () => {
                touching = true;
            }, { passive: true });

            track.addEventListener("touchend", () => {
                touching = false;
            }, { passive: true });

            track.addEventListener("touchcancel", () => {
                touching = false;
            }, { passive: true });

            active.forEach(img => {
                if (!img.complete) {
                    img.addEventListener("load", updateSize);
                }
            });

            window.addEventListener("resize", updateSize);

            updateSize();
            requestAnimationFrame(animate);
        }
    }
    /* 信件 */
    document.querySelectorAll(".letter-button").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-target");
            const dialog = document.getElementById(target);

            if (dialog) {
                dialog.showModal();

                const content = dialog.querySelector(".letter-content");

                // 開啟後，立即回到最上方
                if (content) {
                    content.scrollTop = 0;
                }
            }
        });
    });

    document.querySelectorAll(".letter-close").forEach(button => {
        button.addEventListener("click", () => {
            button.closest("dialog").close();
        });
    });
});