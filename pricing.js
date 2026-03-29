/**
 * pricing.js - Voxtor Brasil
 * Checkout online, animações e interações para a página de preços
 */

(function initPricingExperience() {
  'use strict';

  // ============================================================
  // DOM Elements
  // ============================================================
  const form = document.getElementById('pricingCheckoutForm');
  if (!form) return;

  const apiBase = document.body.dataset.apiBase || 'http://localhost:3333/api';

  // Product catalog
  const products = {
    CALC_FIN: {
      code: 'CALC_FIN',
      name: 'Calculadora Financeira',
      price: 97,
      delivery: 'Liberação automática via Firebase após confirmação do webhook.'
    },
    ERP: {
      code: 'ERP',
      name: 'ERP Voxtor',
      price: 297,
      delivery: 'Acesso provisionado no fluxo interno controlado por Supabase.'
    }
  };

  // Form elements
  const productSelect = document.getElementById('productCode');
  const billingTypeSelect = document.getElementById('billingType');
  const dueDateInput = document.getElementById('dueDate');
  const summaryInline = document.getElementById('checkoutSummaryInline');
  const feedback = document.getElementById('checkoutFeedback');
  const submitButton = document.getElementById('checkoutSubmit');

  // Result elements
  const resultBlock = document.getElementById('checkoutResult');
  const emptyState = document.getElementById('checkoutEmptyState');
  const copyPixButton = document.getElementById('copyPixButton');

  const resultNodes = {
    product: document.getElementById('resultProduct'),
    status: document.getElementById('resultStatus'),
    amount: document.getElementById('resultAmount'),
    paymentId: document.getElementById('resultPaymentId'),
    invoiceUrl: document.getElementById('resultInvoiceUrl'),
    bankSlipUrl: document.getElementById('resultBankSlipUrl'),
    pixBlock: document.getElementById('pixBlock'),
    pixCode: document.getElementById('resultPixCode')
  };

  // ============================================================
  // Utility Functions
  // ============================================================
  function setDefaultDueDate() {
    if (!dueDateInput) return;
    const date = new Date();
    date.setDate(date.getDate() + 3);
    dueDateInput.value = date.toISOString().split('T')[0];
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value || 0));
  }

  function setFeedback(message, type) {
    if (!feedback) return;
    feedback.textContent = message || '';
    feedback.classList.remove('is-error', 'is-success');

    if (type === 'error') {
      feedback.classList.add('is-error');
    } else if (type === 'success') {
      feedback.classList.add('is-success');
    }
  }

  function updateSummary() {
    if (!productSelect || !summaryInline || !billingTypeSelect) return;

    const product = products[productSelect.value];
    const billingType = billingTypeSelect.value;

    // Highlight selected product card
    document.querySelectorAll('[data-product-card]').forEach((card) => {
      const isSelected = card.dataset.productCode === productSelect.value;
      card.classList.toggle('is-selected', isSelected);
    });

    if (!product) {
      summaryInline.innerHTML = `
        <strong>Nenhum produto selecionado</strong>
        <span>Selecione um item para atualizar valor e modelo de entrega.</span>
      `;
      return;
    }

    summaryInline.innerHTML = `
      <strong>${product.name} · ${formatCurrency(product.price)}</strong>
      <span>${billingType} selecionado. ${product.delivery}</span>
    `;
  }

  function showResult(data) {
    const purchase = data.purchase || {};
    const product = data.product || {};
    const asaasPayment = data.asaasPayment || {};

    if (resultNodes.product) resultNodes.product.textContent = product.name || '-';
    if (resultNodes.status) resultNodes.status.textContent = purchase.status || asaasPayment.status || 'PENDING';
    if (resultNodes.amount) resultNodes.amount.textContent = formatCurrency(purchase.amount || product.price || 0);
    if (resultNodes.paymentId) resultNodes.paymentId.textContent = purchase.asaas_payment_id || asaasPayment.id || '-';

    // Invoice URL
    if (resultNodes.invoiceUrl && asaasPayment.invoiceUrl) {
      resultNodes.invoiceUrl.href = asaasPayment.invoiceUrl;
      resultNodes.invoiceUrl.hidden = false;
    } else if (resultNodes.invoiceUrl) {
      resultNodes.invoiceUrl.hidden = true;
    }

    // Bank slip URL
    if (resultNodes.bankSlipUrl && asaasPayment.bankSlipUrl) {
      resultNodes.bankSlipUrl.href = asaasPayment.bankSlipUrl;
      resultNodes.bankSlipUrl.hidden = false;
    } else if (resultNodes.bankSlipUrl) {
      resultNodes.bankSlipUrl.hidden = true;
    }

    // PIX code
    const pixCode = data.pix?.payload || purchase.asaas_pix_copy_paste;
    if (resultNodes.pixCode && pixCode) {
      resultNodes.pixCode.value = pixCode;
      if (resultNodes.pixBlock) resultNodes.pixBlock.hidden = false;
    } else if (resultNodes.pixBlock) {
      resultNodes.pixBlock.hidden = true;
    }

    // Show result, hide empty state
    if (emptyState) emptyState.hidden = true;
    if (resultBlock) resultBlock.hidden = false;

    // Trigger animation on result
    if (resultBlock) {
      resultBlock.style.animation = 'none';
      resultBlock.offsetHeight; // force reflow
      resultBlock.style.animation = 'slide-up 0.5s ease-out';
    }
  }

  // ============================================================
  // API Functions
  // ============================================================
  async function postJson(url, payload) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Erro inesperado na API.');
    }

    return data;
  }

  function getFormPayload() {
    return {
      productCode: productSelect ? productSelect.value : '',
      billingType: billingTypeSelect ? billingTypeSelect.value : '',
      name: document.getElementById('name')?.value.trim() || '',
      email: document.getElementById('email')?.value.trim() || '',
      phone: document.getElementById('phone')?.value.trim() || '',
      cpfCnpj: document.getElementById('cpfCnpj')?.value.trim() || '',
      dueDate: dueDateInput ? dueDateInput.value : ''
    };
  }

  function validatePayload(payload) {
    if (!payload.productCode || !products[payload.productCode]) {
      throw new Error('Selecione um produto válido.');
    }

    if (!payload.name) {
      throw new Error('Informe o nome completo.');
    }

    if (!payload.email) {
      throw new Error('Informe o e-mail.');
    }

    if (!payload.email.includes('@')) {
      throw new Error('Informe um e-mail válido.');
    }

    if (!payload.phone) {
      throw new Error('Informe o telefone.');
    }

    if (!payload.dueDate) {
      throw new Error('Selecione a data de vencimento.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!submitButton) return;

    try {
      const payload = getFormPayload();
      validatePayload(payload);

      // Disable button and show loading state
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span> Criando cobrança...';
      setFeedback('Registrando cliente e gerando cobrança na API...', null);

      // Register customer
      await postJson(`${apiBase}/customers`, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        cpfCnpj: payload.cpfCnpj || undefined
      });

      // Create charge
      const chargeResponse = await postJson(`${apiBase}/charges`, {
        customerEmail: payload.email,
        productCode: payload.productCode,
        billingType: payload.billingType,
        dueDate: payload.dueDate
      });

      showResult(chargeResponse.data || chargeResponse);
      setFeedback('Cobrança criada com sucesso! Agora é só realizar o pagamento.', 'success');

      // Scroll to result
      if (resultBlock) {
        resultBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setFeedback(error.message || 'Não foi possível criar a cobrança. Tente novamente ou fale com um especialista.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Criar cobrança';
      }
    }
  }

  // ============================================================
  // Animations & Scroll Effects
  // ============================================================
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    
    fadeElements.forEach(el => observer.observe(el));
  }

  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  function initProductCardSelection() {
    const selectButtons = document.querySelectorAll('[data-select-product]');
    
    selectButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const code = button.dataset.selectProduct;
        if (productSelect && code) {
          productSelect.value = code;
          updateSummary();
          
          // Smooth scroll to checkout
          const checkoutSection = document.getElementById('checkout-online');
          if (checkoutSection) {
            checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          
          // Highlight effect
          button.style.transform = 'scale(0.98)';
          setTimeout(() => {
            button.style.transform = '';
          }, 150);
        }
      });
    });
  }

  // ============================================================
  // Copy PIX Functionality
  // ============================================================
  function initCopyPix() {
    if (!copyPixButton) return;

    copyPixButton.addEventListener('click', async () => {
      const pixCode = resultNodes.pixCode?.value;
      if (!pixCode) {
        setFeedback('Código PIX não disponível.', 'error');
        return;
      }

      try {
        await navigator.clipboard.writeText(pixCode);
        setFeedback('Código PIX copiado para a área de transferência!', 'success');
        
        // Visual feedback on button
        const originalText = copyPixButton.textContent;
        copyPixButton.textContent = 'Copiado! ✓';
        setTimeout(() => {
          copyPixButton.textContent = originalText;
        }, 2000);
      } catch (error) {
        setFeedback('Não foi possível copiar automaticamente. Selecione e copie manualmente.', 'error');
      }
    });
  }

  // ============================================================
  // Floating Animation for Cards
  // ============================================================
  function initCardHoverEffects() {
    const cards = document.querySelectorAll('.catalog-card, .commerce-panel, .checkout-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
      });
    });
  }

  // ============================================================
  // Form Field Effects
  // ============================================================
  function initFormEffects() {
    const inputs = document.querySelectorAll('.form-field input, .form-field select');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('focused');
      });
    });
  }

  // ============================================================
  // Event Listeners
  // ============================================================
  if (productSelect) {
    productSelect.addEventListener('change', updateSummary);
  }
  
  if (billingTypeSelect) {
    billingTypeSelect.addEventListener('change', updateSummary);
  }
  
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    setDefaultDueDate();
    updateSummary();
    initScrollAnimations();
    initBackToTop();
    initHeaderScroll();
    initProductCardSelection();
    initCopyPix();
    initCardHoverEffects();
    initFormEffects();

    // Add visible class to elements already in view
    setTimeout(() => {
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('visible');
        }
      });
    }, 100);
  }

  init();
})();

// ============================================================
// Additional Animation: Ripple Effect on Buttons
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn, .catalog-action');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      ripple.style.pointerEvents = 'none';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
      });
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
});