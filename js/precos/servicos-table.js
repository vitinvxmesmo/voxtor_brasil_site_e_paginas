// ============================================
// servicos-table.js - Tabela de Serviços
// ============================================

class ServicosTable {
    constructor() {
        this.services = [
            {
                categoria: 'Consultoria TI',
                servico: 'Consultoria em TI Básica',
                descricao: 'Planejamento estratégico, análise contínua da infraestrutura e acompanhamento tecnológico',
                mensal: 500,
                semestral: 450,
                anual: 400
            },
            {
                categoria: 'Consultoria TI',
                servico: 'Consultoria em TI Avançada',
                descricao: 'Horário comercial SLA até 4h Suporte remoto',
                mensal: 1500,
                semestral: 1350,
                anual: 1200
            },
            {
                categoria: 'Suporte Técnico',
                servico: 'Suporte Técnico Bronze',
                descricao: 'Horário comercial SLA até 2h Suporte remoto prioritário',
                mensal: 150,
                semestral: 135,
                anual: 120
            },
            {
                categoria: 'Suporte Técnico',
                servico: 'Suporte Técnico Prata',
                descricao: 'Horário comercial SLA até 2h Suporte remoto prioritário',
                mensal: 350,
                semestral: 315,
                anual: 280
            },
            {
                categoria: 'Suporte Técnico',
                servico: 'Suporte Técnico Ouro',
                descricao: 'Horário comercial SLA até 1h Suporte remoto + presencial sob demanda Monitoramento proativo',
                mensal: 750,
                semestral: 675,
                anual: 600
            },
            {
                categoria: 'Automação & IoT',
                servico: 'Automação & IoT Básica',
                descricao: 'Gestão, manutenção e evolução de soluções automatizadas e dispositivos IoT',
                mensal: 300,
                semestral: 270,
                anual: 240
            },
            {
                categoria: 'Automação & IoT',
                servico: 'Automação & IoT Avançada',
                descricao: 'Gestão, manutenção e evolução de soluções automatizadas e dispositivos IoT',
                mensal: 700,
                semestral: 630,
                anual: 560
            },
            {
                categoria: 'Automação & IoT',
                servico: 'Automação & IoT Corporativa',
                descricao: 'Administração completa de redes, servidores, backup, cloud e segurança da informação',
                mensal: 1200,
                semestral: 1080,
                anual: 960
            },
            {
                categoria: 'Infraestrutura',
                servico: 'Infraestrutura de TI Básica',
                descricao: 'Infraestrutura de TI com ERP',
                mensal: 800,
                semestral: 720,
                anual: 640
            },
            {
                categoria: 'Infraestrutura',
                servico: 'Infraestrutura de TI Empresarial',
                descricao: 'Infraestrutura de TI com ERP',
                mensal: 1800,
                semestral: 1620,
                anual: 1440
            },
            {
                categoria: 'Infraestrutura',
                servico: 'Infraestrutura de TI Corporativa',
                descricao: 'Infraestrutura de TI com ERP',
                mensal: 3500,
                semestral: 3150,
                anual: 2800
            },
            {
                categoria: 'BI & Analytics',
                servico: 'BI Essencial',
                descricao: 'Dashboards, relatórios e análises contínuas para apoiar decisões estratégicas',
                mensal: 600,
                semestral: 540,
                anual: 480
            },
            {
                categoria: 'BI & Analytics',
                servico: 'BI Profissional',
                descricao: 'Dashboards, relatórios e análises contínuas para apoiar decisões estratégicas',
                mensal: 1200,
                semestral: 1080,
                anual: 960
            },
            {
                categoria: 'BI & Analytics',
                servico: 'BI Corporativo',
                descricao: 'Dashboards, relatórios e análises contínuas para apoiar decisões estratégicas',
                mensal: 2500,
                semestral: 2250,
                anual: 2000
            }
        ];
        
        this.currentPeriod = 'mensal';
        this.filterCategory = 'todos';
        
        this.init();
    }
    
    init() {
        this.renderTable();
        this.setupFilters();
        this.setupPeriodTabs();
    }
    
    renderTable() {
        const container = document.getElementById('servicos-table');
        if (!container) return;
        
        let filteredServices = this.services;
        
        if (this.filterCategory !== 'todos') {
            filteredServices = this.services.filter(s => s.categoria === this.filterCategory);
        }
        
        let html = `
            <div class="table-responsive">
                <table class="services-pricing-table">
                    <thead>
                        <tr>
                            <th>Serviço</th>
                            <th>Descrição</th>
                            <th>Mensal</th>
                            <th>Semestral</th>
                            <th>Anual</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        filteredServices.forEach(service => {
            html += `
                <tr>
                    <td><strong>${service.servico}</strong></td>
                    <td>${service.descricao}</td>
                    <td>R$ ${service.mensal.toFixed(2)}</td>
                    <td>R$ ${service.semestral.toFixed(2)}</td>
                    <td>R$ ${service.anual.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="ServicosTable.contratar('${service.servico}', '${this.currentPeriod}')">
                            Contratar
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    setupFilters() {
        const filterSelect = document.getElementById('filter-categoria');
        if (!filterSelect) return;
        
        filterSelect.addEventListener('change', (e) => {
            this.filterCategory = e.target.value;
            this.renderTable();
        });
    }
    
    setupPeriodTabs() {
        const tabs = document.querySelectorAll('.period-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentPeriod = tab.dataset.period;
                this.renderTable();
            });
        });
    }
    
    static contratar(servico, periodo) {
        const url = `/contato.html?servico=${encodeURIComponent(servico)}&periodo=${periodo}`;
        window.location.href = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('servicos-table')) {
        window.ServicosTable = new ServicosTable();
    }
});