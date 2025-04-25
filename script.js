document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('open');
            nav.classList.toggle('open');
        });
    }

    // Adicionar classe active ao link de navegação atual
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    function setActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');

    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }

    window.addEventListener('scroll', toggleBackToTopButton);

    // Filtro de Produtos
    const categoryButtons = document.querySelectorAll('.category');
    const productCards = document.querySelectorAll('.product-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Filtrar produtos
            const category = button.getAttribute('data-category');
            
            productCards.forEach(card => {
                if (category === 'todos') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Testimonial Slider
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialSlider = document.querySelector('.testimonials-slider');

    // Mostrar todos os depoimentos
    testimonials.forEach(testimonial => {
        testimonial.style.display = 'block';
    });

    // Desabilitar funções de slider
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            // Não faz nada
        });

        testimonialSlider.addEventListener('mouseleave', () => {
            // Não faz nada
        });
    }

    // Formulário de Contato
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Recuperar valores do formulário
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Aqui você pode adicionar o código para enviar os dados para um servidor
            // No momento, apenas exibiremos um alerta simulando o envio
            
            console.log(`Nome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nAssunto: ${subject}\nMensagem: ${message}`);
            
            // Simular envio bem-sucedido
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }

    // Header fixo com animação
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animação de scroll suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Fechar o menu mobile se estiver aberto
                if (mobileMenuToggle && mobileMenuToggle.classList.contains('open')) {
                    mobileMenuToggle.classList.remove('open');
                    nav.classList.remove('open');
                }
            }
        });
    });

    // Animar elementos quando ficarem visíveis
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    }

    // Adicionar classe fade-in para animar elementos
    document.querySelectorAll('.about-content, .product-card, .quality-feature, .testimonial').forEach(element => {
        element.classList.add('fade-in');
    });

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Função para detectar dispositivo e ajustar links do WhatsApp
    function adjustWhatsAppLinks() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
        
        whatsappLinks.forEach(link => {
            const phone = link.href.split('wa.me/')[1].split('?')[0];
            const text = link.href.includes('text=') ? link.href.split('text=')[1] : '';
            const encodedText = encodeURIComponent(decodeURIComponent(text));
            
            if (!isMobile) {
                // É desktop, usar o link web.whatsapp.com
                link.href = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
            } else {
                // É mobile, manter o link wa.me
                link.href = `https://wa.me/${phone}?text=${encodedText}`;
            }
        });
    }

    // Ajustar links do WhatsApp
    adjustWhatsAppLinks();

    // Controle de altura do cabeçalho durante scroll
    function handleHeaderOnScroll() {
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', function() {
            // Mantém a altura consistente, apenas aplicando uma classe visual se necessário
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    handleHeaderOnScroll();

    // Funcionalidade para as perguntas frequentes (FAQ)
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle da classe active no item do FAQ
            const faqItem = question.parentElement;
            
            // Fecha todos os outros itens
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Abre/fecha o item atual
            faqItem.classList.toggle('active');
        });
    });
}); 